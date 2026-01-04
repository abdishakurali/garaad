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
import type { SignUpData } from "@/types/auth";
import { EyeOff } from "lucide-react";
import Link from "next/link";
import { validateEmail } from "@/lib/email-validation";

// Define the form schema with enhanced email validation
const formSchema = z.object({
  email: z.string().refine((email) => {
    const validation = validateEmail(email);
    return validation.isValid;
  }, "Fadlan geli email sax ah"),
  password: z
    .string()
    .min(6, "Number sir ah waa inuu ahaadaa ugu yaraan 6 xaraf"),
});

interface AuthDialogProps {
  trigger?: React.ReactNode;
}

export function AuthDialog({ trigger }: AuthDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = useSelector(selectAuthLoading);
  const authState = useSelector((state: RootState) => state.auth);
  const { error } = authState;
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

  // Auto-hide error functionality removed to ensure user sees the error
  // until they try again or dismiss it manually.


  // Error handling is now manual (user dismisses it or tries again)


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isLogin) {
        const response = await dispatch(
          login({ email: values.email, password: values.password })
        ).unwrap();

        if (response?.user) {
          // Successfully logged in - close dialog and let middleware handle routing
          setIsOpen(false);

          // Show success message
          console.log("Waad mahadsantahay! Si guul leh ayaad u soo gashay.");

          // Let the middleware handle routing based on verification and premium status
          // No manual redirects here - middleware will do it correctly
          window.location.href = '/courses'; // This will be intercepted by middleware
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

        const result = await dispatch(signUp(signupData)).unwrap();

        if (result?.user) {
          // Successfully signed up - close dialog and let middleware handle routing
          setIsOpen(false);

          // Show success message
          console.log("Waad mahadsantahay! Si guul leh ayaad u isdiiwaangelisay.");

          // Let the middleware handle routing based on verification status
          window.location.href = '/courses'; // This will be intercepted by middleware
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      // Handle various error formats safely
      const errorMessage =
        error?.message ||
        (typeof error === 'string' ? error : "Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.");

      dispatch(setError(errorMessage));
    }
  };
  // console.log("Auth error waa kan:", error); // Remove this or move it inside catch if needed, strictly it's out of scope here

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            className="font-semibold text-base md:text-lg bg-primary hover:bg-primary/90 text-white hover:text-white shadow-md transition-all"
          >
            Soo gal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-w-[400px] sm:max-w-[450px] md:max-w-[500px] px-6 py-8 rounded-xl shadow-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700
        transition-all duration-300 ease-out transform-gpu
        data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95"
        aria-describedby="auth-description"
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 rounded-xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
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
                    disabled={isLoading}
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
                        placeholder="tusaale@example.com"
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
                            showPassword ? "Qari sirta" : "Muuji sirta"
                          }
                          disabled={isLoading}
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

          {/* Sign up link */}
          <div className="text-center pt-4 border-t flex space-x-3 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Hore umaan isticmaalin Garaad?            </p>
            <Link
              href="/welcome"
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Isdiiwaangeli
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
