"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { getMediaUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Mail, MessageCircle, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

interface PublicProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  location: string;
  profile_picture: string;
  is_premium: boolean;
  created_at: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/public/${username}/`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Profile-ka lama helin");
          } else {
            setError("Qalad ayaa dhacay");
          }
          return;
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Qalad ayaa dhacay");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "Profile-ka lama helin"}</p>
        <Link href="/">
          <Button>Ku soo noqno bogga home-ka</Button>
        </Link>
      </div>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.username || "User";
  const memberSince = profile.created_at ? new Date(profile.created_at).toLocaleDateString("so-SO", { 
    year: "numeric", 
    month: "long" 
  }) : "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <div className="shrink-0">
                {profile.profile_picture ? (
                  <img
                    src={getMediaUrl(profile.profile_picture, "profile_pics")}
                    alt={fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-xl">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                      {(profile.first_name?.[0] || profile.username?.[0] || "U").toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h1>
                <p className="text-gray-600 dark:text-gray-300">@{profile.username}</p>
                
                {profile.is_premium && (
                  <Badge className="mt-2 bg-amber-500 text-white">Premium Member</Badge>
                )}

                {profile.bio && (
                  <p className="mt-4 text-gray-600 dark:text-gray-300">{profile.bio}</p>
                )}

                {/* Location & Member Since */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {memberSince && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Ku soo biiray: {memberSince}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info (if owner viewing - simplified for now show basic info) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Macluumaad xiriir</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{profile.email}</span>
            </div>
            {profile.location && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}