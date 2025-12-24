"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import type { User } from "@/types/auth";
import Link from "next/link";
import AuthService from "@/services/auth";
import { progressService, type UserProgress } from "@/services/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  UserIcon,
  Settings,
  Trophy,
  BookOpen,
  Mail,
  CheckCircle2,
  Users,
  Share2,
  Copy,
  TrendingUp,
} from "lucide-react";
import { Header } from "@/components/Header";
import { getMediaUrl } from "@/lib/utils";
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/authSlice";
import { useToast } from "@/hooks/use-toast";

// Extend User type to include required fields
interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
}

interface ReferralStats {
  referral_code: string;
  referral_points: number;
  referral_count: number;
}

interface ReferralUser {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface ReferralList {
  referred_users: ReferralUser[];
}



export default function ProfilePage() {
  const [user, setUserState] = useState<ExtendedUser | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedUser>>({});
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralList, setReferralList] = useState<ReferralList | null>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api.garaad.org/api/auth/upload-profile-picture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok)
        throw new Error("Ku guuldaraystay in la cusboonaysiiyo profile-ka");

      const updated = await response.json();
      setUserState(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("Ku guuldaraystay in la cusboonaysiiyo profile-ka");
    }
  };

  // Load user from AuthService (cookies)
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = AuthService.getInstance().getCurrentUser();
      if (storedUser) {
        console.log('Profile page: Loaded user from storage:', {
          id: storedUser.id,
          profile_picture: storedUser.profile_picture,
          first_name: storedUser.first_name,
          last_name: storedUser.last_name
        });
        setUserState(storedUser as ExtendedUser);
        setEditForm({
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          username: storedUser.username,
          email: storedUser.email,
        });
      } else {
        setError("Isticmaalaha lama helin");
      }
    } catch (err) {
      console.error("Qalad ayaa dhacay marka la soo raray isticmaalaha:", err);
      setError("Ku guuldaraystay in la soo raro xogta profile-ka");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debug: Log user changes
  useEffect(() => {
    if (user) {
      console.log('Profile page: User state updated:', {
        id: user.id,
        profile_picture: user.profile_picture,
        first_name: user.first_name,
        last_name: user.last_name
      });
    }
  }, [user]);

  // Fetch progress once user is loaded
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const data = await progressService.getUserProgress();
        setProgress(data);
      } catch (err: unknown) {
        console.error(err);
        setError("Ku guuldaraystay in la soo raro xogta horumarinta");
      }
    };
    fetchProgress();
  }, [user]);

  // Fetch referral data
  useEffect(() => {
    function getToken() {
      const authService = AuthService.getInstance();
      return authService.getToken();
    }

    const fetchReferral = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const [statsResponse, listResponse] = await Promise.all([
          fetch('https://api.garaad.org/api/auth/referral-stats/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://api.garaad.org/api/auth/referral-list/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statsResponse.ok && listResponse.ok) {
          const [statsData, listData] = await Promise.all([
            statsResponse.json(),
            listResponse.json(),
          ]);

          setReferralStats(statsData);
          setReferralList(listData);
        }
      } catch (error) {
        console.error("Failed to fetch referral data:", error);
      }
    };

    // Listen for referral code generation events
    const handleReferralCodeGenerated = () => {
      const token = getToken();
      if (!token) return;

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";

      fetch(`${apiBase}/api/auth/generate-referral-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.referral_code && referralStats) {
            setReferralStats({
              ...referralStats,
              referral_code: data.referral_code,
            });
          }
        })
        .catch((error) => {
          console.error("Failed to generate referral code:", error);
        });
    };

    window.addEventListener('referralCodeGenerated', handleReferralCodeGenerated);

    fetchReferral();

    // Cleanup event listener
    return () => {
      window.removeEventListener('referralCodeGenerated', handleReferralCodeGenerated);
    };
  }, []);

  // Handle profile picture update
  const handleProfilePictureUpdate = async (file: File) => {
    try {
      setIsUploadingPicture(true);
      const formData = new FormData();
      formData.append('profile_picture', file);

      console.log('Profile picture update: Starting upload...');

      const response = await fetch('https://api.garaad.org/api/auth/upload-profile-picture/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getInstance().getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile picture update failed:', response.status, errorText);
        throw new Error(`Failed to update profile picture: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile picture update response:', data);

      // Update the user profile in Redux store and local state
      if (data.user) {
        console.log('Profile picture update: Updating with full user data');
        // Update Redux store
        dispatch(setUser(data.user));
        // Update local state
        setUserState(data.user as ExtendedUser);
        // Update AuthService user data
        AuthService.getInstance().setCurrentUser(data.user);
      } else if (data.profile_picture && user) {
        console.log('Profile picture update: Updating with profile_picture only');
        // If the response only contains the profile picture URL, update the user object
        const updatedUser = { ...user, profile_picture: data.profile_picture };
        dispatch(setUser(updatedUser));
        setUserState(updatedUser);
        AuthService.getInstance().setCurrentUser(updatedUser);
      }

      console.log('Profile picture update: Successfully updated user data');

      // Show success message
      toast({
        title: "Sawirka profile-ka waa la cusboonaysiiyay!",
        description: "Sawirkaaga cusub waa la muujin doonaa.",
      });
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast({
        title: "Cillad ayaa dhacday",
        description: error instanceof Error ? error.message : "Fadlan isku day mar kale.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPicture(false);
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Waa la soo raraya...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="text-destructive bg-card p-6 rounded-lg shadow-lg border">
            <h2 className="text-lg font-semibold mb-2">Khalad ayaa dhacay</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Isticmaalaha lama helin</p>
        </div>
      </div>
    );
  }

  const progressItems = progress?.length || 0;
  const lessonsCompleted =
    progress?.filter((lesson) => lesson.status === "completed").length || 0;

  const completedPercentage =
    progressItems && lessonsCompleted
      ? Math.round((lessonsCompleted / progressItems) * 100)
      : 0;
  console.log(AvatarImage);
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Cover Photo Section */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/20" />
          {/* Cover photo overlay pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-white/5" />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Sidebar - Profile Info */}
            <div className="lg:col-span-3">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                {/* Profile Picture */}
                <div className="relative pt-12 pb-6 px-6 text-center">
                  <div
                    className="relative inline-block"
                  >
                    <AuthenticatedAvatar
                      key={user.profile_picture || 'default'}
                      src={getMediaUrl(user.profile_picture, 'profile_pics')}
                      alt={`${user.first_name} ${user.last_name}`}
                      fallback={`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                      size="xl"
                      className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white dark:border-gray-700 shadow-xl mx-auto"
                      editable={true}
                      onImageUpdate={handleProfilePictureUpdate}
                      isUpdating={isUploadingPicture}
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />

                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                      {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">@{user.username}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">Arday Garaad</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.is_email_verified && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-3" />
                        <span>Email la xaqiijiyey</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{lessonsCompleted}</div>
                      <div className="text-xs text-gray-500">Casharka</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{completedPercentage}%</div>
                      <div className="text-xs text-gray-500">Horumarinta</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
                  <Button
                    onClick={() => setShowEditModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Cusboonaysii Profile-ka
                  </Button>

                  <Link href="/community" className="block w-full">
                    <Button variant="outline" className="w-full rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20">
                      <Users className="h-4 w-4 mr-2" />
                      Ku Biir Bulshada
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Progress Overview Card - Clean & Simple */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white rounded-lg p-2 mr-3">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Horumarintaada
                      </h2>
                      <p className="text-sm text-gray-500">Sidee ayaad u socodaa</p>
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg px-3 py-1">
                    <span className="font-medium text-sm">
                      {completedPercentage}%
                    </span>
                  </div>
                </div>

                {/* Simple Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Casharrada</span>
                    <span className="text-sm text-gray-500">{lessonsCompleted} ee {progressItems}</span>
                  </div>
                  <Progress value={completedPercentage} className="h-2 bg-gray-200" />
                </div>

                {/* Simple Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-blue-600">{lessonsCompleted}</div>
                    <div className="text-xs text-gray-500">Dhameeyey</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-600">{progressItems - lessonsCompleted}</div>
                    <div className="text-xs text-gray-500">Haray</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-400">{Math.floor(completedPercentage / 10)}</div>
                    <div className="text-xs text-gray-500">Sharaf</div>
                  </div>
                </div>
              </div>

              {/* Lessons Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Casharka oo dhan
                </h3>

                <div className="space-y-3">
                  {progress && progress.length > 0 ? progress.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${item.status === "completed" ? "bg-green-500" : "bg-gray-400"
                          }`}>
                          {item.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.lesson_title}</h4>
                          <p className="text-sm text-gray-500">Casharka #{index + 1}</p>
                        </div>
                      </div>
                      <Badge
                        variant={item.status === "completed" ? "default" : "secondary"}
                        className={`${item.status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-400 text-gray-900"
                          }`}
                      >
                        {item.status === "completed" ? "La dhameeyey" : "Socda"}
                      </Badge>
                    </div>
                  )) : (
                    <div className="text-center text-gray-400 py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Wali cashar ma jiro.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              {/* Simple Achievement Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-lg p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {completedPercentage}% la dhameeyey
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sii wad waxbarashadaada
                  </p>
                </div>
              </div>

              {/* Simple Referral Section */}
              {referralStats && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                  {/* Clean Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white rounded-lg p-2 mr-3">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Asxaabtada caan garee
                        </h3>
                        <p className="text-sm text-gray-500">
                          Wadaag oo dhibco hel
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Simple Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-blue-600">
                          {referralStats.referral_points ?? 0}
                        </div>
                        <div className="text-sm text-gray-500">Dhibcaha</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-gray-600">
                          {referralStats.referral_count ?? 0}
                        </div>
                        <div className="text-sm text-gray-500">Asxaab</div>
                      </div>
                    </div>

                    {/* Simple Referral Code */}
                    {referralStats.referral_code && (
                      <div className="mb-6">
                        <div className="text-center mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Koodkaaga
                          </h4>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="text-center">
                            <div className="text-xl font-mono font-semibold text-gray-900 dark:text-white mb-3">
                              {referralStats.referral_code}
                            </div>

                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(referralStats.referral_code);
                                  alert('Koodka waa la koobbiyeeyey!');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                              >
                                <Copy className="h-4 w-4" />
                                Koobiyee
                              </button>

                              <button
                                onClick={() => {
                                  const shareText = `Ku biir Garaad - platform-ka waxbarashada! Isticmaal koodkeyga: ${referralStats.referral_code}`;
                                  if (navigator.share) {
                                    navigator.share({ text: shareText });
                                  } else {
                                    navigator.clipboard.writeText(shareText);
                                    alert('Qoraalka waa la koobbiyeeyey!');
                                  }
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                              >
                                <Share2 className="h-4 w-4" />
                                Wadaag
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Simple Instructions */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Sidee loo shaqeeyo?
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-start">
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">1</span>
                          <span>Wadaag koodkaaga asxaabtada</span>
                        </div>
                        <div className="flex items-start">
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">2</span>
                          <span>Markay ku biiraan, dhibco hesho</span>
                        </div>
                        <div className="flex items-start">
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">3</span>
                          <span>Isticmaal dhibcaha hadiyado cusub</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple Friends List */}
              {referralList && referralList.referred_users && referralList.referred_users.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Asxaabtaada ({referralList.referred_users.length})
                  </h3>

                  <div className="space-y-3">
                    {referralList.referred_users.slice(0, 3).map((referredUser) => (
                      <div key={referredUser.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm bg-blue-600 text-white font-medium">
                            {referredUser.first_name[0]}{referredUser.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {referredUser.first_name} {referredUser.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(referredUser.created_at).toLocaleDateString('so-SO', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {referralList.referred_users.length > 3 && (
                      <div className="text-center pt-2">
                        <div className="text-sm text-gray-500">
                          +{referralList.referred_users.length - 3} asxaab kale
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Generate Referral Code Section */}
              {referralStats && !referralStats.referral_code && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-lg p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Samee kood la wareejiyo
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Samee kood si aad u wareejiso asxaabtada
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          const authService = AuthService.getInstance();
                          const token = authService.getToken();
                          if (!token) {
                            alert("Fadlan mar kale gal");
                            return;
                          }

                          const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";
                          const response = await fetch(`${apiBase}/api/auth/generate-referral-code/`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          });

                          if (!response.ok) {
                            throw new Error("Ku guuldaraystay");
                          }

                          // Refresh the data
                          window.dispatchEvent(new CustomEvent("referralCodeGenerated"));
                          alert("Koodka waa la sameeyey!");
                        } catch {
                          alert("Ku guuldaraystay. Fadlan mar kale isku day.");
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                    >
                      Samee Kood
                    </button>
                  </div>
                </div>
              )}

              {/* Motivational Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-lg p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Sii wad!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cashar kasta oo aad dhameeyso waa guul cusub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal - keeping the existing modal */}
        {showEditModal && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Cusboonaysii Profile-ka</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Koowaad</Label>
                    <Input id="first_name" name="first_name" value={editForm.first_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli magacaaga koowaad" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Dambe</Label>
                    <Input id="last_name" name="last_name" value={editForm.last_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli magacaaga dambe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Isticmaalaha</Label>
                    <Input id="username" name="username" value={editForm.username || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli magaca isticmaalaha" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Iimaylka</Label>
                    <Input id="email" name="email" type="email" value={editForm.email || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli iimaylkaaga" />
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="rounded-full">Jooji</Button>
                  <Button type="submit" className="rounded-full bg-blue-600 text-white hover:bg-blue-700">Kaydi Isbedelada</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
