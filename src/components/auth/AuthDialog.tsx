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
          className="font-semibold text-base md:text-lg"
        >
          Soo gal
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[375px] sm:max-w-[480px] md:max-w-[550px] px-4 py-6 rounded-xl shadow-2xl border bg-white
        transition-all duration-300 ease-in-out
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]"
        aria-describedby="auth-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 animate-in fade-in-50 duration-500">
            Soo gal
          </DialogTitle>
        </DialogHeader>

        <div id="auth-description" className="sr-only">
          Doorashooyinka soo gelista: Google, Facebook ama email
        </div>

        <div className="space-y-4 animate-in fade-in-50 duration-500 delay-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => {
                      dispatch(setError(null));
                    }}
                  >
                    <X size={16} />
                  </button>
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email-kaaga</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        disabled={isLoading}
                        className="text-base md:text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>lamberka sirta ah</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Geli lambarka sirta"
                          {...field}
                          disabled={isLoading}
                          className="text-base md:text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setIsShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2  transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1.5"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  "w-full relative text-base md:text-lg",
                  isLoading && "animate-bounce"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
