"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { User } from "@/types/auth";
import AuthService from "@/services/auth";
import { progressService, type UserProgress } from "@/services/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Loader2 } from "lucide-react";

// Extend User type to include required fields
interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedUser>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updated = await response.json();
      setUser(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  // Load user from AuthService (cookies)
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = AuthService.getInstance().getCurrentUser();
      if (storedUser) {
        setUser(storedUser as ExtendedUser);
        setEditForm({
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          username: storedUser.username,
          email: storedUser.email,
        });
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch progress once user is loaded
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const data = await progressService.getUserProgress();
        setProgress(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load progress data");
      }
    };
    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">User not found</div>
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

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <Card className="mb-8 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 border">
              <AvatarFallback className="text-2xl bg-gray-50">
                {user.first_name[0]}
                {user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="mb-6 w-full max-w-md">
          <TabsTrigger value="progress" className="flex-1">
            Horumarka
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            Settings-ka
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Horumarkaada</h2>
            </CardHeader>
            <CardContent>
              {!progress || progress.length === 0 ? (
                <p className="text-gray-500">Wax horumr ah maadan samayn</p>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Horumark Guud</p>
                      <p className="text-lg font-medium">
                        {completedPercentage}% Dhamaystiran
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Cashar la dhameeyay
                      </p>
                      <p className="text-lg font-medium">
                        {lessonsCompleted} of {progressItems}
                      </p>
                    </div>
                  </div>

                  <Progress value={completedPercentage} className="h-2" />

                  <div className="space-y-4 mt-8">
                    {progress.map((item) => (
                      <Card
                        key={item.id}
                        className="border border-gray-100 shadow-none hover:bg-gray-50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{item.lesson_title}</h3>
                            <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {item.status === "completed"
                                ? "Completed"
                                : "In Progress"}
                            </span>
                          </div>
                          <Progress
                            value={item.status === "completed" ? 100 : 0}
                            className="h-1.5"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <Button onClick={() => setShowEditModal(true)}>
                Wax ka adal profileka
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Magaca koowaad
                    </h3>
                    <p>{user.first_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Last Name
                    </h3>
                    <p>{user.last_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Username
                    </h3>
                    <p>@{user.username}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={editForm.first_name || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={editForm.last_name || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={editForm.username || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
