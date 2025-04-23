"use client";

import type React from "react";
import { selectCurrentUser, logoutAction } from "@/store/features/authSlice";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  LogOut,
  Award,
  Trophy,
  Users,
  Edit,
  Check,
  ChevronRight,
  BookOpen,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";

// Types for progress data
type ProgressItem = {
  id: string;
  user: string;
  lesson: string;
  lesson_title: string;
  module_title: string;
  status: string;
  score: number;
  last_visited_at: string;
  completed_at: string | null;
};

type ProgressResponse = {
  results: ProgressItem[];
};

// Mock progress data
const mockProgressData: ProgressResponse = {
  results: [
    {
      id: "1",
      user: "user1",
      lesson: "lesson1",
      lesson_title: "Introduction to Somali Grammar",
      module_title: "Somali Basics",
      status: "completed",
      score: 95,
      last_visited_at: "2023-06-15T10:30:00Z",
      completed_at: "2023-06-15T10:30:00Z",
    },
    {
      id: "2",
      user: "user1",
      lesson: "lesson2",
      lesson_title: "Common Phrases",
      module_title: "Conversational Somali",
      status: "in_progress",
      score: 70,
      last_visited_at: "2023-06-14T09:15:00Z",
      completed_at: null,
    },
    {
      id: "3",
      user: "user1",
      lesson: "lesson3",
      lesson_title: "Advanced Verb Conjugation",
      module_title: "Grammar Mastery",
      status: "not_started",
      score: 0,
      last_visited_at: "2023-06-10T14:20:00Z",
      completed_at: null,
    },
  ],
};

// Tribe data
const abtirsiData = {
  Daarood: ["Majeerteen", "Dhulbahante", "Warsangeli", "Mareexaan", "Ogaden"],
  Hawiye: ["Abgaal", "Habar Gidir", "Murursade", "Duduble", "Sheekhaal"],
  Dir: ["Gadabuursi", "Ciise", "Biimaal", "Surre"],
  Isaaq: ["Habar Awal", "Habar Jeclo", "Habar Yoonis", "Garhajis"],
  Raxanweyn: ["Digil", "Mirifle", "Sagaal", "Hubeer"],
  Jareerweyne: ["Bantu", "Gosha", "Makane", "Shidle"],
  Benadiri: ["Reer Xamar", "Reer Merka", "Reer Baraawe"],
  Gabooye: ["Tumaal", "Yibir", "Madhiban"],
  Ashraaf: ["Shariif", "Reer Faqi"],
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// const iconVariants = {
//   initial: { scale: 1 },
//   hover: {
//     scale: 1.2,
//     rotate: 5,
//     transition: { type: "spring", stiffness: 400, damping: 10 },
//   },
// };

// Progress Component
const UserProgress = ({ progress }: { progress: ProgressResponse }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Not Started
          </span>
        );
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Learning Progress</CardTitle>
        <CardDescription>
          Track your progress across all lessons and modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progress.results.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.status === "completed" ? (
                    <Bookmark className="h-5 w-5 text-green-500" />
                  ) : item.status === "in_progress" ? (
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  )}
                  <h3 className="font-medium">{item.lesson_title}</h3>
                </div>
                <p className="text-sm text-gray-500">{item.module_title}</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  {item.score > 0 && (
                    <span className="text-sm font-medium">
                      Score: {item.score}%
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-500">
                {item.status === "completed" && item.completed_at ? (
                  <p>Completed on {formatDate(item.completed_at)}</p>
                ) : (
                  <p>Last visited {formatDate(item.last_visited_at)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Showing {progress.results.length} lessons
        </div>
      </CardFooter>
    </Card>
  );
};

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [tribe, setTribe] = useState<{
    qabiil: keyof typeof abtirsiData | "";
    laan: string;
  }>({ qabiil: "", laan: "" });
  const [progress, setProgress] = useState<ProgressResponse>(mockProgressData);

  const router = useRouter();
  const { toast } = useToast();

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTribe({
        qabiil: (user.profile?.qabiil as keyof typeof abtirsiData) || "",
        laan: user.profile?.laan || "",
      });
    }
  }, [user]);

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lms/user-progress/`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch progress data: ${response.statusText}`
          );
        }
        const data = await response.json();
        setProgress(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setProgress(mockProgressData); // Fallback to mock data
      }
    };

    fetchProgressData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // toast({
    //   title: "Profile Updated",
    //   description: "Your profile has been successfully updated.",
    // });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
    setFormData((prev) => ({
      ...prev,
      current_password: "",
      new_password: "",
      confirm_password: "",
    }));
  };

  const handleTribeUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tribe.qabiil) {
      toast({
        title: "Selection Required",
        description: "Please select your tribe.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tribe Updated",
      description: "Your tribe information has been successfully updated.",
    });
  };

  const handleLogout = () => {
    // In a real app, you would dispatch the logout action
    // dispatch(logoutAction());
    dispatch(logoutAction());

    router.push("/welcome");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: `${isDarkMode ? "Light" : "Dark"} Mode Activated`,
      description: `You've switched to ${isDarkMode ? "light" : "dark"} mode.`,
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Main Content */}
      <main className="pt-20 md:pt-0 pb-20">
        <div className="max-w-5xl mx-auto p-4 md:p-8 mt-16">
          {/* Profile Header with Cover Image */}
          <div className="relative mb-8">
            <div className="absolute -bottom-16 left-4 md:left-8">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    // src={user?.avatar || "/placeholder.svg"}
                    src="https://api.dicebear.com/7.x/initials/svg?seed=test"
                    alt={user?.first_name || "User"}
                  />
                  <AvatarFallback className="text-3xl">
                    {user?.first_name?.[0] || user?.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute -bottom-16 right-4 md:right-8 flex space-x-2">
              <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-20 mb-8">
            <h1 className="text-3xl font-bold">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-gray-500">@{user?.username}</p>
            {/* <p className="mt-2">{user?.bio}</p> */}
          </div>

          {/* Stats Cards */}
          {/* <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              {
                icon: <Trophy size={20} />,
                title: "Rank",
                value: user?.stats?.rank || "N/A",
                description: "Global position",
              },
              {
                icon: <Award size={20} />,
                title: "Points",
                value: user?.stats?.points || "0",
                description: "Total earned",
              },
              {
                icon: <Gift size={20} />,
                title: "Completed",
                value: user?.stats?.completed || "0",
                description: "Courses finished",
              },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <motion.div
                        variants={iconVariants}
                        initial="initial"
                        whileHover="hover"
                        className="mr-2 text-primary"
                      >
                        {stat.icon}
                      </motion.div>
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Settings Tabs */}
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User size={16} />
                <span>Akkoonkaaga</span>
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <Bell size={16} />
                <span>Doorashaada</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>proggresska</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                <span>Amniga</span>
              </TabsTrigger>
              <TabsTrigger value="tribe" className="flex items-center gap-2">
                <Users size={16} />
                <span>Qabiilka</span>
              </TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate}>
                        <div className="grid gap-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first_name">First Name</Label>
                              <Input
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last_name">Last Name</Label>
                              <Input
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              First Name
                            </h3>
                            <p className="mt-1 text-lg">{user?.first_name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Last Name
                            </h3>
                            <p className="mt-1 text-lg">{user?.last_name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Email
                            </h3>
                            <p className="mt-1 text-lg">{user?.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Username
                            </h3>
                            <p className="mt-1 text-lg">@{user?.username}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Bio
                          </h3>
                          {/* <p className="mt-1">{user?.bio || "No bio yet"}</p> */}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Member Since
                          </h3>
                          {/* <p className="mt-1">
                            {new Date(
                              user?.date_joined || ""
                            ).toLocaleDateString()}
                          </p> */}
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress">
                <UserProgress progress={progress} />
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <div className="mr-2 text-primary">
                              <Bell size={20} />
                            </div>
                            <Label>Email Notifications</Label>
                          </div>
                          <p className="text-sm text-gray-500 ">
                            Receive email notifications about your learning
                            progress
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <div className="mr-2 text-primary">
                              {isDarkMode ? (
                                <Sun size={20} />
                              ) : (
                                <Moon size={20} />
                              )}
                            </div>
                            <Label>Dark Mode</Label>
                          </div>
                          <p className="text-sm text-gray-500 ">
                            Toggle between light and dark themes
                          </p>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          // onCheckedChange={toggleDarkMode}
                        />
                      </div>

                      <Separator />

                      <motion.div
                        className="flex items-center justify-between"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="space-y-0.5">
                          <Label>Language</Label>
                          <p className="text-sm text-gray-500 ">
                            Change the interface language
                          </p>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="so">Somali</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">
                            Current Password
                          </Label>
                          <Input
                            id="current_password"
                            name="current_password"
                            type="password"
                            value={formData.current_password}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            name="new_password"
                            type="password"
                            value={formData.new_password}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            value={formData.confirm_password}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit">Change Password</Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className={`mt-6`}>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>
                      Manage your account and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Delete Account</Label>
                          <p className="text-sm text-gray-500 ">
                            Permanently delete your account and all associated
                            data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Logout</Label>
                          <p className="text-sm text-gray-500 ">
                            Log out from your account on this device
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tribe">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Tribe</CardTitle>
                    <CardDescription>
                      Select or update your tribe information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTribeUpdate}>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="qabiil">Tribe</Label>
                          <Select
                            value={tribe.qabiil}
                            onValueChange={(qabiil) =>
                              setTribe({
                                qabiil: qabiil as keyof typeof abtirsiData,
                                laan: "",
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your tribe" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(abtirsiData).map((key) => (
                                <SelectItem key={key} value={key}>
                                  {key}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {tribe.qabiil && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                          >
                            <Label htmlFor="laan">Sub-tribe</Label>
                            <Select
                              value={tribe.laan}
                              onValueChange={(laan) =>
                                setTribe((prev) => ({ ...prev, laan }))
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your sub-tribe" />
                              </SelectTrigger>
                              <SelectContent>
                                {abtirsiData[tribe.qabiil]?.map((sub) => (
                                  <SelectItem key={sub} value={sub}>
                                    {sub}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        <div className="mt-6">
                          <div className="rounded-lg border p-4 bg-gray-50">
                            <h3 className="font-medium mb-2">
                              Current Selection
                            </h3>
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-primary" />
                              <span>
                                {tribe.qabiil ? (
                                  <>
                                    {tribe.qabiil}
                                    {tribe.laan && ` / ${tribe.laan}`}
                                  </>
                                ) : (
                                  "No tribe selected"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardFooter className="flex justify-end mt-6 px-0">
                        <Button type="submit">Save Tribe Information</Button>
                      </CardFooter>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y"
                >
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      variants={itemVariants}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item === 1
                              ? "bg-green-100 text-green-600"
                              : item === 2
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {item === 1 ? (
                            <Check size={16} />
                          ) : item === 2 ? (
                            <Trophy size={16} />
                          ) : (
                            <Award size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {item === 1
                              ? "Completed Lesson"
                              : item === 2
                              ? "Earned Badge"
                              : "Reached Level 5"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item === 1
                              ? "Introduction to Somali Grammar"
                              : item === 2
                              ? "Vocabulary Master"
                              : "Advanced Learner Status"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {item === 1
                              ? "2 hours ago"
                              : item === 2
                              ? "Yesterday"
                              : "3 days ago"}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-center p-4">
                <Button variant="outline">View All Activity</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
