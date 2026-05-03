"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { User } from "@/types/auth";
import AuthService from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Pencil,
  Mail,
  MessageCircle,
  MapPin,
  Camera,
  Save,
  X,
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

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Profile-ka lama helin</p>
        </div>
      </>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  {user.profile_picture ? (
                    <img
                      src={getMediaUrl(user.profile_picture, "profile_pics")}
                      alt={fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-4xl font-bold text-white">
                        {user.first_name?.[0] || user.username[0]}
                      </span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
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
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-gray-500">@{user.username}</p>

                {/* Edit Button */}
                {!isEditing && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Macluumaadka Profile-ka</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email (read only) */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Bio</span>
                </div>
                {isEditing ? (
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Wax ku sheeg naftaada..."
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-gray-900">{user.bio || "Ma jiro bio"}</p>
                )}
              </div>

              {/* Location */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Goobta</span>
                </div>
                {isEditing ? (
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Mogadishu, Somalia"
                  />
                ) : (
                  <p className="text-gray-900">{user.location || "Ma定义 gelin"}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">WhatsApp</span>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      name="whatsapp_dial"
                      value={formData.whatsapp_dial}
                      onChange={handleInputChange}
                      className="w-20"
                      placeholder="+252"
                    />
                    <Input
                      name="whatsapp_local"
                      value={formData.whatsapp_local}
                      onChange={handleInputChange}
                      placeholder="612345678"
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {user.whatsapp_number || "Ma定义 gelin"}
                  </p>
                )}
              </div>

              {/* First/Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Magaca Koowaad</span>
                  {isEditing ? (
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 mt-1">
                      {user.first_name || "—"}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Magaca Dambe</span>
                  {isEditing ? (
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 mt-1">
                      {user.last_name || "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      const wa = splitWhatsapp(user.whatsapp_number);
                      setFormData({
                        first_name: user.first_name || "",
                        last_name: user.last_name || "",
                        bio: user.bio || "",
                        location: user.location || "",
                        whatsapp_dial: wa.dial,
                        whatsapp_local: wa.local,
                      });
                    }}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Jooji
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Kaydi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}