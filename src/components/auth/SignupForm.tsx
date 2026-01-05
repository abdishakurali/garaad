import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signUp, selectAuthLoading, selectAuthError, setError } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store";
import type { SignUpData } from "@/types/auth";
import { cn } from "@/lib/utils";
import { validateEmail } from "@/lib/email-validation";

interface SignupFormProps {
  onClose?: () => void;
}

// Signup form component for collecting user information
export function SignupForm({ onClose }: SignupFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    promoCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ... (inside handleSubmit)

  const signupData: SignUpData = {
    email: formData.email.trim(),
    password: formData.password.trim(),
    name: formData.firstName.trim(),
    age: parseInt(formData.age),
    promo_code: formData.promoCode.trim() || undefined,
    onboarding_data: {
      goal: "learn_math", // Default goal
      preferred_study_time: "self_paced", // Default preferred study time
      topic: "general_math", // Default topic
      math_level: "beginner", // Default math level
      minutes_per_day: 30, // Default minutes per day
    },
  };

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

    // Enhanced email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Fadlan geli email sax ah';
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
        promo_code: formData.promoCode.trim() || undefined,
        onboarding_data: {
          goal: "learn_math", // Default goal
          preferred_study_time: "self_paced", // Default preferred study time
          topic: "general_math", // Default topic
          math_level: "beginner", // Default math level
          minutes_per_day: 30, // Default minutes per day
        },
      };

      // Attempt signup - the backend will handle existing user scenarios
      const result = await dispatch(signUp(signupData)).unwrap();

      // Only redirect if signup was successful and no auth error
      if (result && !authError) {
        // Check if the user's email is already verified
        if (result.user?.is_email_verified) {
          // User is already verified, check premium status
          console.log("Emailkaaga la xaqiijiyay.");

          // Check premium status and redirect accordingly
          if (result.user.is_premium) {
            router.push('/courses');
          } else {
            router.push('/subscribe');
          }
        } else {
          // User needs email verification first
          console.log("Fadlan xaqiiji emailkaaga.");

          // After email verification, user will be redirected based on premium status
          router.push(`/verify-email?email=${result.user?.email || formData.email}`);
        }
        onClose?.();
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Handle specific case where user already exists
      if (error instanceof Error && error.message.includes("horey ayaa loo diiwaangeliyay")) {
        // User already exists - suggest they should verify email or login
        console.log("Isticmaalaha ayaa horey u jira: Emailkaagu horey ayuu u diiwaangelisan yahay.");
        router.push(`/verify-email?email=${formData.email}`);
      }
      // Error will be handled by the useEffect that watches authError
    }
  };

  // Handle auth error from Redux
  React.useEffect(() => {
    if (authError) {
      dispatch(setError(null));
    }
  }, [authError, dispatch]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
    >
      <div
        className="bg-background rounded-2xl p-8 md:p-10 max-w-2xl w-full mx-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-border animate-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-foreground">Waxbarashadaada waa diyaar!</h2>
            <p className="text-muted-foreground">Samee akoon bilaash ah si aad u bilowdo.</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-bold text-foreground mb-1.5 block">
                Email-kaaga
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Iimaylka"
                className={cn(
                  "w-full p-3 md:p-4 border border-input bg-background rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg transition-all",
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
                  <Label htmlFor="password" className="text-sm font-bold text-foreground mb-1.5 block">
                    Furaha sirta ah
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Furaha sirta ah"
                      className={cn(
                        "w-full p-3 md:p-4 border border-input bg-background rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg pr-12 transition-all",
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                    <Label htmlFor="firstName" className="text-sm font-bold text-foreground mb-1.5 block">
                      Magaca koowaad
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Magaca koowaad"
                      className={cn(
                        "w-full p-3 md:p-4 border border-input bg-background rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg transition-all",
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
                    <Label htmlFor="age" className="text-sm font-bold text-foreground mb-1.5 block">
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
                        "w-full p-3 md:p-4 border border-input bg-background rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg transition-all",
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
                <div className="pt-2">
                  <Label htmlFor="promoCode" className="text-sm font-bold text-foreground mb-1.5 block">
                    Koodka Dalacsiinta (Ikhtiyaari)
                  </Label>
                  <Input
                    id="promoCode"
                    name="promoCode"
                    type="text"
                    placeholder="Garaad#2026"
                    className="w-full p-3 md:p-4 border border-input bg-background rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg transition-all"
                    style={{ fontSize: '16px' }}
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full bg-primary text-primary-foreground rounded-xl p-4 hover:bg-primary/90 transition-all font-black",
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

          <p className="text-xs text-center text-muted-foreground">
            Marka aad guujiso Is diiwaan geli, waxaad ogoshahay{" "}
            <a href="#" className="underline hover:text-foreground">Shuruudaha</a> iyo{" "}
            <a href="#" className="underline hover:text-foreground">Xogta gaarka ah</a>
          </p>

          <div className="text-center pt-2">
            <span className="text-sm text-muted-foreground">Horay ma u diiwaan gashay? </span>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-primary font-bold hover:underline"
            >
              Soo gal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
