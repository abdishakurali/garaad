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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "@/store/features/authSlice";
import type { AppDispatch } from "@/store";
import { useEffect, useState } from "react";
import { z } from "zod";
import { signup } from "@/store/features/authSlice";
import type { RootState } from "@/store";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { SignUpData } from "@/types/auth";

// Define the form schema
const formSchema = z.object({
  email: z.string().email("Fadlan geli email sax ah"),
  password: z
    .string()
    .min(6, "Number sir ah waa inuu ahaadaa ugu yaraan 6 xaraf"),
});

export function AuthDialog() {
  const [isLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { error, loading: isLoading, user } = authState;
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset form and error when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset();
      dispatch(clearError());
    }
  }, [open, form, dispatch]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      setOpen(false);
      router.push("/courses");
    }
  }, [isAuthenticated, router]);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
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
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isLogin) {
        const result = await dispatch(
          login({ email: values.email, password: values.password })
        );
        if (result) {
          toast({
            title: "Waad mahadsantahay!",
            description: "Si aad u bilowdo, fadlan xaqiiji emailkaaga.",
          });
          router.push("/courses");
        }
      } else {
        const signupData: SignUpData = {
          email: values.email,
          password: values.password,
          name: values.email.split("@")[0],
          age: 18,
          onboarding_data: {
            goal: "learn_math",
            learning_approach: "self_paced",
            topic: "general_math",
            math_level: "beginner",
            minutes_per_day: 30,
          },
        };
        const result = await dispatch(signup(signupData));
        if (result) {
          toast({
            title: "Waad mahadsantahay!",
            description: "Si aad u bilowdo, fadlan xaqiiji emailkaaga.",
          });
          router.push("/courses");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Khalad ayaa dhacay",
        description: "Fadlan isku day mar kale.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold text-base md:text-lg">
          Soo gal
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[400px] sm:max-w-[500px] md:max-w-[600px] px-4 py-6 rounded-2xl shadow-2xl border bg-white
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
          Doorashooyinka soo gelista: Google, Facebook, ama email
        </div>

        <div className="space-y-4 animate-in fade-in-50 duration-500 delay-200">



          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ama email ku soo gal
              </span>
            </div>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => dispatch(clearError())}
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
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>lamberka sir ah</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Geli lambarka sirta"
                          {...field}
                          disabled={isLoading}
                          className="text-base md:text-lg"
                        />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
