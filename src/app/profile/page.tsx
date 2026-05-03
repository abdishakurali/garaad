"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { User } from "@/types/auth";
import AuthService from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Pencil,
  Mail,
  MessageCircle,
  MapPin,
  Camera,
  Save,
  X,
  User,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { getMediaUrl } from "@/lib/utils";
import { toast } from "sonner";

interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
  bio?: string;
  whatsapp_number?: string;
  location?: string;
}

const DEFAULT_WHATSAPP_DIAL = "+252";

export default function ProfilePage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    whatsapp_dial: DEFAULT_WHATSAPP_DIAL,
    whatsapp_local: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authService = AuthService.getInstance();
        const profile = await authService.getBasicProfile();
        const extProfile = profile as ExtendedUser;
        setUser(extProfile);
        
        const wa = splitWhatsapp(extProfile.whatsapp_number);
        setFormData({
          first_name: extProfile.first_name || "",
          last_name: extProfile.last_name || "",
          bio: extProfile.bio || "",
          location: extProfile.location || "",
          whatsapp_dial: wa.dial,
          whatsapp_local: wa.local,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  function splitWhatsapp(value?: string): { dial: string; local: string } {
    const raw = (value || "").trim();
    if (!raw) return { dial: DEFAULT_WHATSAPP_DIAL, local: "" };
    const normalized = raw.startsWith("+") ? raw : `+${raw}`;
    if (normalized.startsWith("+252")) {
      return { dial: "+252", local: normalized.slice(4) };
    }
    return { dial: DEFAULT_WHATSAPP_DIAL, local: normalized.replace(/\D/g, "") };
  }

  function buildWhatsapp(dial: string, local: string): string {
    const cleanDial = (dial || DEFAULT_WHATSAPP_DIAL).replace(/[^\d+]/g, "");
    const cleanLocal = (local || "").replace(/\D/g, "");
    if (!cleanLocal) return "";
    return `${cleanDial}${cleanLocal}`;
  }

  const handleProfilePictureUpdate = async (file: File) => {
    setIsUploading(true);
    try {
      const authService = AuthService.getInstance();
      await authService.uploadProfilePicture(file);
      const updated = await authService.getBasicProfile();
      setUser(updated as ExtendedUser);
      toast.success("Sawirka profile-ka waa la cusboonaysiiyay!");
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.message || "Sawirka profile-ka wuu ku guuldaraystay");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const authService = AuthService.getInstance();
      const whatsapp = buildWhatsapp(formData.whatsapp_dial, formData.whatsapp_local);
      
      await authService.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        location: formData.location,
        whatsapp_number: whatsapp || undefined,
      });
      
      const updated = await authService.getBasicProfile();
      setUser(updated as ExtendedUser);
      setIsEditing(false);
      toast.success("Profile-ka waa la cusboonaysiiyay!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Profile-ka wuu ku guuldaraystay");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (!user) return;
    const wa = splitWhatsapp(user.whatsapp_number);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      bio: user.bio || "",
      location: user.location || "",
      whatsapp_dial: wa.dial,
      whatsapp_local: wa.local,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <p className="text-gray-500">Profile-ka lama helin</p>
        </div>
      </>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
        <div className="max-w-xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Cover Background */}
            <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            
            <div className="px-6 pb-6">
              {/* Profile Picture */}
              <div className="relative -mt-16 mb-4">
                <div className="inline-block relative">
                  {user.profile_picture ? (
                    <img
                      src={getMediaUrl(user.profile_picture, "profile_pics")}
                      alt={fullName}
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-4xl font-bold text-white">
                        {user.first_name?.[0] || user.username[0]}
                      </span>
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-white text-gray-700 p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all shadow-md border border-gray-200">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProfilePictureUpdate(file);
                      }}
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Username */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full px-4"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  {isEditing ? (
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.first_name || "—"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  {isEditing ? (
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-900">{user.last_name || "—"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Bio</label>
                {isEditing ? (
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl min-h-[60px]">
                    <p className="text-gray-600">{user.bio || "No bio yet"}</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Location</label>
                {isEditing ? (
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Mogadishu, Somalia"
                    className="rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{user.location || "Not set"}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      name="whatsapp_dial"
                      value={formData.whatsapp_dial}
                      onChange={handleInputChange}
                      placeholder="+252"
                      className="w-24 rounded-xl bg-gray-50 border-gray-200"
                    />
                    <Input
                      name="whatsapp_local"
                      value={formData.whatsapp_local}
                      onChange={handleInputChange}
                      placeholder="612345678"
                      className="flex-1 rounded-xl bg-gray-50 border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{user.whatsapp_number || "Not set"}</span>
                  </div>
                )}
              </div>

              {/* Public Profile Link */}
              <div className="pt-2">
                <a
                  href={`/${user.username}`}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900 font-medium">View Public Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-blue-400" />
                </a>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 rounded-xl"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}