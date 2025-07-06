import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signUp, selectAuthLoading, selectAuthError, setError } from "@/store/features/authSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store";
import type { SignUpData } from "@/types/auth";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  onClose?: () => void;
}

// Signup form component for collecting user information
export function SignupForm({ onClose }: SignupFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes and show additional fields when email contains @
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Show additional fields when email contains @
    if (name === 'email' && value.includes('@')) {
      setShowAdditionalFields(true);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Fadlan geli emailkaaga';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Fadlan geli email sax ah';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Fadlan geli furaha sirta ah';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Furaha sirta ah waa inuu ahaadaa ugu yaraan 6 xaraf';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Fadlan geli magacaaga';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Fadlan geli da&apos;daada';
    } else if (parseInt(formData.age) < 5 || parseInt(formData.age) > 100) {
      newErrors.age = 'Fadlan geli da&apos;da sax ah';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const signupData: SignUpData = {
        email: formData.email.trim(),
        password: formData.password.trim(),
        name: formData.firstName.trim(),
        age: parseInt(formData.age),
        onboarding_data: {
          goal: "learn_math", // Default goal
          preferred_study_time: "self_paced", // Default preferred study time
          topic: "general_math", // Default topic
          math_level: "beginner", // Default math level
          minutes_per_day: 30, // Default minutes per day
        },
      };

      // Use unwrap() to properly handle errors
      const result = await dispatch(signUp(signupData)).unwrap();

      // Only redirect if signup was successful and no auth error
      if (result && !authError) {
        // Check if the user's email is already verified
        if (result.user?.is_email_verified) {
          // User is already verified, redirect to appropriate page
          toast({
            variant: "default",
            title: "Waad mahadsantahay!",
            description: "Emailkaaga horey ayaa la xaqiijiyay. Waxaad hadda isticmaali kartaa adeegga.",
          });

          // Redirect based on premium status
          if (result.user?.is_premium) {
            router.push('/courses');
          } else {
            router.push('/subscribe');
          }
        } else {
          // User needs email verification
          toast({
            variant: "default",
            title: "Waad mahadsantahay!",
            description: "Si aad u bilowdo, fadlan xaqiiji emailkaaga.",
          });

          // Get the user from the result payload
          const user = result.user;
          if (user?.is_premium) {
            router.push('/courses');
          } else {
            router.push('/subscribe');
          }
        }
        onClose?.();
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Error will be handled by the useEffect that watches authError
    }
  };

  // Handle auth error from Redux
  React.useEffect(() => {
    if (authError) {
      toast({
        variant: "destructive",
        title: "Khalad ayaa dhacay",
        description: authError,
      });
      dispatch(setError(null));
    }
  }, [authError, toast, dispatch]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="bg-white rounded-xl p-10 max-w-2xl w-full mx-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Waxbarashadaada waa diyaar!</h2>
              <p className="text-gray-600">Samee akoon bilaash ah si aad u bilowdo.</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Emailkaaga
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Iimaylka"
                  className={cn(
                    "w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg",
                    errors.email && "border-red-500 focus:ring-red-500/20"
                  )}
                  style={{ fontSize: '16px' }}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {showAdditionalFields && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Furaha sirta ah
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Furaha sirta ah"
                        className={cn(
                          "w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg pr-12",
                          errors.password && "border-red-500 focus:ring-red-500/20"
                        )}
                        style={{ fontSize: '16px' }}
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        Magaca koowaad
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Magaca koowaad"
                        className={cn(
                          "w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg",
                          errors.firstName && "border-red-500 focus:ring-red-500/20"
                        )}
                        style={{ fontSize: '16px' }}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                        Da&apos;da
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="5"
                        max="100"
                        placeholder="Da&apos;da"
                        className={cn(
                          "w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg",
                          errors.age && "border-red-500 focus:ring-red-500/20"
                        )}
                        style={{ fontSize: '16px' }}
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.age && (
                        <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={cn(
                  "w-full bg-black text-white rounded-xl p-4 hover:bg-black/90 transition-colors relative",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                disabled={isLoading || !showAdditionalFields}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    <span>Waa la socodaa...</span>
                  </div>
                ) : (
                  "Is diiwaan geli"
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Marka aad guujiso Is diiwaan geli, waxaad ogoshahay{" "}
              <a href="#" className="underline">Shuruudaha</a> iyo{" "}
              <a href="#" className="underline">Xogta gaarka ah</a>
            </p>

            <div className="text-center">
              <span className="text-sm text-gray-600">Horay ma u diiwaan gashay? </span>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-blue-600 hover:underline"
              >
                Soo gal
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
