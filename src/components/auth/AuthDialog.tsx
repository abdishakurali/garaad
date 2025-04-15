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
import { useDispatch, useSelector } from 'react-redux';
import { login, resetError } from '@/store/features/authSlice';
import type { AppDispatch } from '@/store';
import { useEffect, useState } from "react";
import { z } from "zod";
import { signup } from "@/store/features/authSlice";
import type { RootState } from "@/store";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Define the form schema
const formSchema = z.object({
  email: z.string().email("Fadlan geli email sax ah"),
  password: z.string().min(6, "Password-ka waa inuu ahaadaa ugu yaraan 6 xaraf"),
});

export function AuthDialog() {
  const [isLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { error, isLoading } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Cilad ayaa dhacday",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isLogin) {
        const result = await dispatch(login(data)).unwrap();
        if (result && result.user) {
          setOpen(false); // Close the dialog
          router.push("/courses");
        }
      } else {
        const signupData = {
          ...data,
          name: data.email.split("@")[0],
          goal: "learn",
          learning_approach: "structured",
          topic: "general",
          math_level: "intermediate",
          minutes_per_day: 30,
        };
        const result = await dispatch(signup(signupData)).unwrap();
        if (result && result.user) {
          setOpen(false); // Close the dialog
          router.push("/courses");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold">
          Soo gal
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="auth-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Soo gal
          </DialogTitle>
        </DialogHeader>

        <div id="auth-description" className="sr-only">
          Doorashooyinka soo gelista: Google, Facebook, ama email
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 mb-4 cursor-not-allowed relative"
            disabled
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Kusoo gal Google
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
              Dhowaan
            </span>
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 mb-4 cursor-not-allowed relative"
            disabled
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Kusoo gal Facebook
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
              Dhowaan
            </span>
          </Button>

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
                      onClick={() => dispatch(resetError())}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className={cn(
                    "w-full relative",
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
