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
  TrendingUp,
  Flame,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { getMediaUrl } from "@/lib/utils";
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/authSlice";
import { API_BASE_URL } from "@/lib/constants";

import { DashboardProfile } from "@/services/auth";

interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
  age?: number;
  bio?: string;
}

export default function ProfilePage() {
  const [user, setUserState] = useState<ExtendedUser | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedUser>>({});
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [dashboardProfile, setDashboardProfile] = useState<DashboardProfile | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authService = AuthService.getInstance();
      const updated = await authService.updateProfile(editForm);
      setUserState(updated as ExtendedUser);
      setShowEditModal(false);
      alert("Profile-ka waa la cusboonaysiiyay!");
    } catch (err) {
      console.error(err);
      setError("Ku guuldaraystay in la cusboonaysiiyo profile-ka");
    }
  };

  // Load user data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      const authService = AuthService.getInstance();
      try {
        const [basic, dashboard] = await Promise.all([
          authService.getBasicProfile(),
          authService.getDashboardProfile()
        ]);

        setUserState(basic as ExtendedUser);
        setDashboardProfile(dashboard);

        setEditForm({
          first_name: basic.first_name,
          last_name: basic.last_name,
          username: basic.username,
          email: basic.email,
          bio: (basic as any).bio,
          age: (basic as any).age,
        });
      } catch (err) {
        console.error("Qalad ayaa dhacay marka la soo raray isticmaalaha:", err);
        setError("Ku guuldaraystay in la soo raro xogta profile-ka");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch progress
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

  // Handle profile picture update with file type validation
  const handleProfilePictureUpdate = async (file: File) => {
    try {
      // Validate file type before upload
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        alert("Nooca faylka aan la aqbalin. Isticmaal JPG, PNG, GIF, ama BMP.");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("Faylka aad ka weyn yahay. Fadlan door hal ka yar 5MB.");
        return;
      }

      setIsUploadingPicture(true);
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(`${API_BASE_URL}/api/auth/upload-profile-picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getInstance().getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.profile_picture?.[0] || `Failed to update profile picture: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // Update user state
      if (data.user) {
        dispatch(setUser(data.user));
        setUserState(data.user as ExtendedUser);
        AuthService.getInstance().setCurrentUser(data.user);
      } else if (data.profile_picture && user) {
        const updatedUser = { ...user, profile_picture: data.profile_picture };
        dispatch(setUser(updatedUser));
        setUserState(updatedUser);
        AuthService.getInstance().setCurrentUser(updatedUser);
      }

      alert("Sawirka profile-ka waa la cusboonaysiiyay!");
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      alert("Cillad ayaa dhacday: " + (error instanceof Error ? error.message : "Fadlan isku day mar kale."));
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
  const lessonsCompleted = progress?.filter((lesson) => lesson.status === "completed").length || 0;
  const completedPercentage = progressItems && lessonsCompleted
    ? Math.round((lessonsCompleted / progressItems) * 100)
    : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Simplified Cover */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                {/* Profile Picture & Info */}
                <div className="relative pt-8 pb-6 px-6 text-center">
                  <AuthenticatedAvatar
                    key={user.profile_picture || 'default'}
                    src={getMediaUrl(user.profile_picture, 'profile_pics')}
                    alt={`${user.first_name} ${user.last_name}`}
                    fallback={`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                    size="xl"
                    className="h-24 w-24 border-4 border-white dark:border-gray-700 shadow-xl mx-auto"
                    editable={true}
                    onImageUpdate={handleProfilePictureUpdate}
                    isUpdating={isUploadingPicture}
                  />

                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">@{user.username}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">Arday Garaad</p>
                </div>

                {/* Contact */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.is_email_verified && (
                    <div className="flex items-center text-sm text-green-600 mt-2">
                      <CheckCircle2 className="h-4 w-4 mr-3" />
                      <span>Email la xaqiijiyey</span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                        <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{dashboardProfile?.streak?.current || 0}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Maalin</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{dashboardProfile?.xp || 0}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">XP</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                        <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{dashboardProfile?.league?.name || "Liig"}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Horyaal</div>
                    </div>
                  </div>
                </div>

                {/* Community Badge */}
                {dashboardProfile?.community_profile && (
                  <div className="mx-6 mb-6 p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Heerka Bulshada</div>
                    <div className="text-lg font-bold flex items-center justify-between">
                      {dashboardProfile.community_profile.badge_level}
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                        {dashboardProfile.community_profile.total_posts} qoraal
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Actions */}
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

            {/* Right: Progress & Lessons */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
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

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Casharrada</span>
                    <span className="text-sm text-gray-500">{lessonsCompleted} ee {progressItems}</span>
                  </div>
                  <Progress value={completedPercentage} className="h-2 bg-gray-200" />
                </div>

                {/* Stats Grid */}
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

              {/* Lessons List */}
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
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Cusboonaysii Profile-ka</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Koowaad</Label>
                        <Input id="first_name" name="first_name" value={editForm.first_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Liban" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Dambe</Label>
                        <Input id="last_name" name="last_name" value={editForm.last_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Garaad" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-200">Da'da</Label>
                      <Input id="age" name="age" type="number" value={editForm.age || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="25" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-200">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={editForm.bio || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full flex min-h-[100px] rounded-lg border border-input bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Wax nooga sheeg naftaada..."
                      />
                    </div>
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
