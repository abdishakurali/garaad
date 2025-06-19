"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  signUp,
  setError,
  selectAuthLoading,
} from "@/store/features/authSlice";
import type { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { SignUpData } from "@/types/auth";
import { eye, EyeOff } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  email: z.string().email("Fadlan geli email sax ah"),
  password: z
    .string()
    .min(6, "Number sir ah waa inuu ahaadaa ugu yaraan 6 xaraf"),
});

export function AuthDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const [isLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = useSelector(selectAuthLoading);
  const authState = useSelector((state: RootState) => state.auth);
  const { error, user } = authState;
  const isAuthenticated = !!user;
  const [showPassword, setIsShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset form and error when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      dispatch(setError(null));
    }
  }, [isOpen, form, dispatch]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      router.push("/courses");
    }
  }, [isAuthenticated, router]);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(setError(null));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Khalad ayaa dhacay",
        description: error,
      });
      dispatch(setError(null));
    }
  }, [error, toast, dispatch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isLogin) {
        const result = await dispatch(
          login({ email: values.email, password: values.password })
        );
        if (result) {
          router.push("/courses");
        }
      } else {
        const signupData: SignUpData = {
          email: values.email,
          password: values.password,
          name: values.email.split("@")[0],
          age: 18, // Default age
          onboarding_data: {
            goal: "learn_math", // Default goal
            preferred_study_time: "self_paced", // Default preferred study time
            topic: "general_math", // Default topic
            math_level: "beginner", // Default math level
            minutes_per_day: 30, // Default minutes per day
          },
        };
        const result = await dispatch(signUp(signupData));
        if (result) {
          router.push("/courses");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-semibold text-base md:text-lg bg-primary hover:bg-primary/90 text-white hover:text-white shadow-md transition-all"
        >
          Soo gal
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[400px] sm:max-w-[450px] md:max-w-[500px] px-6 py-8 rounded-xl shadow-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700"
        aria-describedby="auth-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Soo gal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(setError(null))}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Email-kaaga
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        disabled={isLoading}
                        className="h-12 text-base focus-visible:ring-2 focus-visible:ring-primary/50 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Lambarka sirta ah
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Geli lambarka sirta"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base pr-12 focus-visible:ring-2 focus-visible:ring-primary/50 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setIsShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={cn(
                  "w-full h-12 text-base md:text-lg font-medium bg-primary hover:bg-primary/90 transition-all",
                  isLoading && "animate-pulse"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Soo galaya...
                  </>
                ) : (
                  "Soo gal"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
