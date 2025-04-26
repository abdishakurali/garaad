/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  signup,
  selectAuthError,
  selectIsLoading,
} from "@/store/features/authSlice";
import { useToast } from "@/hooks/use-toast";
import type { AppDispatch } from "@/store";







// Step titles
const stepTitles = [
  "Waa maxey hadafkaaga ugu weyn?", // What's your top goal?
  "Waqtigee kuugu habboon inad waxbarato?",
  "Maadada aad ugu horayn rabto inaad barato?", // Which topic do you want to explore first?
  "Heerkaaga xisaabta?", // What's your math comfort level?
  "Immisa daqiiqo ayad rabtaa inad Wax-barato maalin walba?",
  "Fadlan geli Xogtaaga:", // Please enter your email
];

// Step 1: Initial goal selection
const goals = [
  {
    id: "Horumarinta xirfadaha",
    text: "Horumarinta xirfadaha",
    badge: "Hal adkaanta hal daal ma leh",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"
        />
      </svg>
    ),
  },
  {
    id: "La socoshada cilmiga",
    text: "La socoshada cilmiga",
    badge: "Aqoon la'aan waa iftiin la'aan",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12Z"
        />
      </svg>
    ),
  },
  {
    id: "Guul dugsiyeedka",
    text: "Guul dugsiyeedka",
    badge: "Wax barashadu waa ilays",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
        />
      </svg>
    ),
  },
  {
    id: "Waxbarashada ilmahayga",
    text: "Waxbarashada ilmahayga",
    badge: "Ubadku waa mustaqbalka",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,3C13.66,3 15,4.34 15,6C15,7.66 13.66,9 12,9C10.34,9 9,7.66 9,6C9,4.34 10.34,3 12,3M12,11C14.21,11 16,9.21 16,7C16,4.79 14.21,3 12,3C9.79,3 8,4.79 8,7C8,9.21 9.79,11 12,11M12,13C9.33,13 4,14.34 4,17V20H20V17C20,14.34 14.67,13 12,13Z"
        />
      </svg>
    ),
  },

  {
    id: "Caawinta ardaydayda",
    text: "Caawinta ardaydayda",
    badge: "Macallin waa iftiin",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z"
        />
      </svg>
    ),
  },
];
const learningApproach = [
  {
    id: "Aroorti Subaxda inta aan quraacaynayo",
    text: "Aroorti Subaxda inta aan quraacaynayo",
    badge:
      "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ (الزمر: 9)",
    icon: "☀",
  },
  {
    id: " Waqtiga Nasashasha intaan Khadaynayo.",
    text: " Waqtiga Nasashasha intaan Khadaynayo.",
    badge: "وَقُل رَّبِّ زِدْنِي عِلْمًا (طه: 114)",
    icon: "��",
  },
  {
    id: "Habeenki ah ka dib cashada ama Kahor intan seexanin",
    text: "Habeenki ah ka dib cashada ama Kahor intan seexanin",
    badge:
      "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ (المجادلة: 11)",

    icon: "🌙",
  },
  {
    id: "Waqti kale oo maalintayda ah",
    text: "Waqti kale oo maalintayda ah",
    badge:
      "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنْتُمْ لَا تَعْلَمُونَ (النحل: 43)",
    icon: "📺",
  },
];

// Step 3: Topic selection

const topics = [
  {
    id: "math",
    text: "Xisaabta",
    badge: "Xisaab iyo xikmad waa walaalo",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M13,7.1L14.1,6L15.5,7.4L16.9,6L18,7.1L16.6,8.5L18,9.9L16.9,11L15.5,9.6L14.1,11L13,9.9L14.4,8.5L13,7.1M6.2,7.1L7.6,8.5L9,7.1L10.1,8.2L8.7,9.6L10.1,11L9,12.1L7.6,10.7L6.2,12.1L5.1,11L6.5,9.6L5.1,8.2L6.2,7.1M18,16H6V14H18V16Z"
        />
      </svg>
    ),
  },
  {
    id: "science & programming",
    text: "Saynis & Injineernimo",
    badge: "Wax kasta cilmi baa lagu gaaraa",
    disabled: true,
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M20,19.88V22L18.2,21.71L15,22L11.8,21.71L9,22V19.88C9,19.38 9.27,18.93 9.71,18.69L11.8,17.71L15,18L18.2,17.71L20.29,18.69C20.73,18.93 21,19.38 21,19.88V22L20,19.88M15,16L11.8,15.71L9,16V14.5L7.14,13.86C6.73,13.72 6.32,13.62 5.91,13.53L5,13.34C4.41,13.21 4,12.68 4,12.07V11C4,10.47 4.31,9.97 4.8,9.74L7.73,8.27C8.25,8 8.82,7.82 9.41,7.74L11.8,7.29L15,7.57L18.2,7.29L20.59,7.74C21.18,7.82 21.75,8 22.27,8.27L23.2,8.74V9.36L21,10V12L17,11V13L15,13.5V16Z"
        />
      </svg>
    ),
  },

  {
    id: "data-analysis",
    text: "Xogta Falanqeynta",
    badge: "Fahan xogta iyo muhiimkeeda",
    disabled: true,

    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3,13H11V5H3M13,19H21V11H13M3,19H11V15H3V19M13,5V9H21V5"
        />
      </svg>
    ),
  },
  {
    id: "logical-reasoning",
    text: "Fikirka iyo Xalinta",
    badge: "Xalinta mushkiladaha ayaa muhiim ah",
    disabled: true,

    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M11,17H13V19H11V17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7C13.31,7 14.42,7.83 14.83,9H17V11H14.83C14.42,12.17 13.31,13 12,13A2,2 0 0,1 10,11H7V9H10C10.58,7.83 11.69,7 12,7Z"
        />
      </svg>
    ),
  },
  {
    id: "puzzles",
    text: "Tijaabooyinka (puzzles)",
    badge: "Ku tababar maskaxdaada xalinta dhibta",
    disabled: true,

    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M10,2A2,2 0 0,1 12,4A2,2 0 0,1 10,6A2,2 0 0,1 8,4A2,2 0 0,1 10,2M7.5,9.5C7.5,11.43 8.61,13 10,13V17H8V21H16V17H14V13C15.39,13 16.5,11.43 16.5,9.5A4.5,4.5 0 0,0 12,5A4.5,4.5 0 0,0 7.5,9.5Z"
        />
      </svg>
    ),
  },
];

// Step 4: Math comfort level with all levels
const topicLevels = [
  {
    title: "Xisaabta aasaasiga ah",
    description:
      "Waxaan doonayaa inaan ka bilaabo aasaaska xisaabta si aan u fahmo",
    example: "2,000 + 500 = ?",
    level: "Arithmetic",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M13,7H17V9H13V7M11,15H7V13H11V15M11,11H7V9H11V11M11,7H7V5H11V7M13,11V15H17V11H13Z"
        />
      </svg>
    ),
  },
  {
    title: "Aljebra aasaasiga ah",
    description:
      "Waxaan fahmi karaa isticmaalka xarfaha iyo calaamadaha xisaabta",
    example: "x + 5 = 12",
    level: "Basic Algebra",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M12,17H8V15H12V17M15,11H8V9H15V11M18,7H8V5H18V7Z"
        />
      </svg>
    ),
  },
  {
    title: "Aljebra sare",
    description:
      "Waxaan si fiican u fahmi karaa xiriirka xisaabta iyo jaantuskeeda",
    example: "y = 2x + 1",
    level: "Algebra",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M8,17H10V13.67L13.33,17H15L11,12.67L14.67,9H13L10,12.33V7H8V17Z"
        />
      </svg>
    ),
  },
  {
    title: "Calculus",
    description: "Waxaan fahmi karaa isbedelka iyo cabbirka xisaabta",
    example: "dy/dx (x²)",
    level: "Calculus",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M15,17H7.21L11.25,13L7.21,9H15V11H13.21L11.79,12.41L10.38,13.82L13.21,17H15V17Z"
        />
      </svg>
    ),
  },
  {
    title: "Xisaabta nolol maalmeedka",
    description: "Waxaan ku dabbiqi karaa xisaabta arrimaha nolol maalmeedka",
    example:
      "Haddii alaab qiimaheedu yahay $50, cashuurta (VAT) 15% tahay, waa maxay qiimaha guud?",
    level: "Real-World Algebra",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3,17H7V15H3V17M3,11H13V9H3V11M3,5V7H17V5H3M19,7V21H21V7H19M15,11H17V13H15V11M15,15H17V17H15V15Z"
        />
      </svg>
    ),
  },
  {
    title: "Cabbirka iyo qaababka",
    description: "Waxaan fahmi karaa cabbirka iyo qaababka kala duwan",
    example: "Ka hel wareegga goobaab dhererkiisu yahay 10cm",
    level: "Geometry",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,2L2,22H22M13,18H11V16H13M13,14H11V9H13"
        />
      </svg>
    ),
  },
  {
    title: "Xisaabta xaglaha",
    description: "Waxaan fahmi karaa xiriirka xaglaha iyo dhererkooda",
    example: "Ka hel sin(30°)",
    level: "Trigonometry",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,13C19,16.9 16.9,19 13,19H9V5H13C16.9,5 19,7.1 19,11C19,11.9 18.8,12.8 18.5,13.5L19,13M13,7H11V11H13C14.7,11 15,10.2 15,9.5C15,8.8 14.7,8 13,8M13,13H11V17H13C14.7,17 15,16.2 15,15.5C15,14.8 14.7,14 13,14Z"
        />
      </svg>
    ),
  },
  {
    title: "Shaqooyinka xisaabeed",
    description: "Waxaan fahmi karaa shaqooyinka xisaabeed iyo isticmaalkooda",
    example: "f(x) = x² + 2x waa maxay qiimaha marka x = 3?",
    level: "Functions",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path fill="currentColor" d="M10,3H14V9H19L12,22L5,9H10V3Z" />
      </svg>
    ),
  },
  {
    title: "Tirakoobka iyo suurtogalnimada",
    description: "Waxaan xisaabin karaa celceliska iyo suurtogalnimada xogta",
    example: "Waa maxay celceliska 75, 80, 85, 90, 95?",
    level: "Statistics and Probability",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3,17H7V15H3V17M3,11H13V9H3V11M3,5V7H17V5H3M19,7V21H21V7H19M15,11H17V13H15V11M15,15H17V17H15V15Z"
        />
      </svg>
    ),
  },
  {
    title: "Tilmaamayaasha xisaabeed",
    description:
      "Waxaan fahmi karaa tilmaamayaasha xisaabeed iyo isticmaalkooda",
    example: "A = (2,3) iyo B = (4,6) ka hel masaafada u dhexeysa",
    level: "Vectors",
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3,17L17,3H21V7L7,21H3V17M15.06,5L19,8.94V5H15.06Z"
        />
      </svg>
    ),
  },
];

const learningGoals = [
  {
    id: "5 daqiiqo?",
    text: "5 daqiiqo?",
    badge: "Talaabo yar, guul weyn",
    icon: "🕔",
  },
  {
    id: "10 daqiiqo?",
    text: "10 daqiiqo?",
    badge: "Waqtigaaga si fiican u isticmaal",
    icon: "🕙",
  },
  {
    id: "15 daqiiqo?",
    text: "15 daqiiqo?",
    badge: "Adkaysi iyo dadaal",
    icon: "🕕",
  },
  {
    id: "20 daqiiqo?",
    text: "20 daqiiqo?",
    badge: "Waxbarasho joogto ah",
    icon: "🕖",
  },
];

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, number | string>>({});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: ""
  });
  const steps = [goals, learningApproach, topics, topicLevels, learningGoals];
  const router = useRouter();
  const progress = (currentStep / (steps.length + 2)) * 100;

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const { toast } = useToast();

  const handleSelect = (value: number | string) => {
    setSelections((prev) => ({ ...prev, [currentStep]: value }));
  };

  const handleContinue = () => {
    // Allow progression through all steps except final submission
    if (currentStep < steps.length + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate all data
      if (!userData.name.trim() || !userData.email.trim() || !userData.password.trim() || !userData.age.trim()) {
        toast({
          variant: "destructive",
          title: "Khalad ayaa dhacay",
          description: "Fadlan buuxi dhammaan xogta",
        });
        return;
      }

      // Check if all selections are made
      if (Object.keys(selections).length < 5) {
        toast({
          variant: "destructive",
          title: "Khalad ayaa dhacay",
          description: "Fadlan buuxi dhammaan su'aalaha",
        });
        return;
      }

      // Format the request body
      const signUpData = {
        email: userData.email.trim(),
        password: userData.password.trim(),
        first_name: userData.name.trim(),
        last_name: userData.name.trim(),
        age: parseInt(userData.age),
        onboarding_data: {
          goal: String(selections[0]).trim(),
          learning_approach: String(selections[1]).trim(),
          topic: String(selections[2]).trim(),
          math_level: String(selections[3]).trim(),
          minutes_per_day: parseInt(String(selections[4]).split(" ")[0]),
        },
      };

      console.log("Submitting signup data:", signUpData);

      // Use Redux for signup
      const result = await dispatch(signup(signUpData));

      if (result) {
        console.log("Signup successful");
        toast({
          variant: "default",
          title: "Mahadsanid!",
          description: "Diiwaangelinta ayaa loo sameeyay si guul leh",
        });
        router.push("/courses");
      }
    } catch (error: any) {
      console.error("Submission failed:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Wax khalad ah ayaa dhacay";
      toast({
        variant: "destructive",
        title: "Khalad ayaa dhacay",
        description: errorMessage === "Email already exists"
          ? "Emailkan horey ayaa loo diiwaangeliyay. Fadlan isticmaal email kale"
          : errorMessage,
      });
    }
  };

  const currentOptions = steps[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 relative">


        <div className="text-center mb-8">
          {/* Progress bar */}
          <Progress.Root
            className="relative overflow-hidden bg-[#E6F4EA] h-1"
            value={progress}
          >
            <Progress.Indicator
              className="bg-[#137333] w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </div>

        <div className="space-y-8">
          <div className="py-8">
            {/* Step Title */}
            <h2 className="text-2xl font-bold mb-8">
              {currentStep <= steps.length
                ? stepTitles[currentStep]
                : "Fadlan geli Xogtaaga"}
            </h2>

            {/* Display Redux error if it exists */}
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200 text-red-800 border-r-4 border-r-red-500">
                <AlertTitle className="text-red-900 flex items-center gap-2">
                  Khalad ayaa dhacay <span className="text-xl">⚠️</span>
                </AlertTitle>
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Options Grid */}
            {currentStep < 3 && (
              <div className="grid gap-4">
                {currentOptions.map((option: any) => (
                  <div key={option.id}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(option.id);
                      }}
                      className="w-full group relative"
                      disabled={option.disabled || isLoading}
                    >
                      <div
                        className={cn(
                          "flex items-center p-4 rounded-lg border transition-all",
                          "hover:border-primary/50 hover:shadow-sm",
                          selections[currentStep] === option.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200",
                          option.disabled &&
                          "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm p-2">
                          {option.icon}
                        </div>
                        <div className="flex-1 text-left px-4">
                          {option.text}
                        </div>
                        {option.disabled && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                            Dhowaan
                          </span>
                        )}
                      </div>

                      {selections[currentStep] === option.id && (
                        <div className="absolute -top-2 left-4 px-3 py-1 bg-[#FFFBE6] text-[#594214] text-sm rounded-full border border-[#FFE588]">
                          {option.badge}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topicLevels.map((level) => (
                  <div key={level.level}>
                    <button
                      onClick={() => handleSelect(level.level)}
                      className="w-full text-left"
                      disabled={isLoading}
                    >
                      <div
                        className={cn(
                          "p-6 rounded-lg border transition-all h-full",
                          "hover:border-primary/50 hover:shadow-sm",
                          selections[currentStep] === level.level
                            ? "border-primary bg-primary/5"
                            : "border-gray-200"
                        )}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white shadow-sm p-2 mb-4">
                          {level.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          {level.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {level.description}
                        </p>
                        <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                          {level.example}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="grid gap-4">
                {currentOptions.map((option: any) => (
                  <div key={option.id}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(option.id);
                      }}
                      className="w-full group relative"
                      disabled={option.disabled || isLoading}
                    >
                      <div
                        className={cn(
                          "flex items-center p-4 rounded-lg border transition-all",
                          "hover:border-primary/50 hover:shadow-sm",
                          selections[currentStep] === option.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200",
                          option.disabled &&
                          "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm p-2">
                          {option.icon}
                        </div>
                        <div className="flex-1 text-left px-4">
                          {option.text}
                        </div>
                        {option.disabled && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                            Dhowaan
                          </span>
                        )}
                      </div>

                      {selections[currentStep] === option.id && (
                        <div className="absolute -top-2 left-4 px-3 py-1 bg-[#FFFBE6] text-[#594214] text-sm rounded-full border border-[#FFE588]">
                          {option.badge}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Magacaaga</label>
                    <input
                      type="text"
                      placeholder="Geli magacaaga"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Da`da</label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      placeholder="Geli da'daada"
                      value={userData.age}
                      onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Emailkaaga</label>
                  <input
                    type="email"
                    placeholder="Geli emailkaaga"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Passwordkaaga</label>
                  <input
                    type="password"
                    placeholder="Geli passwordkaaga"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                className={cn(
                  "w-full rounded-lg py-4 font-semibold transition-colors",
                  currentStep === 6
                    ? "bg-primary text-white hover:bg-primary/90"
                    : currentStep === 5
                      ? userData.email && userData.password && userData.name && userData.age
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : selections[currentStep]
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed",
                  isLoading && "opacity-70 cursor-wait"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentStep === 5) {
                    if (!isLoading) {
                      handleSubmit(e);
                    }
                  } else {
                    if (selections[currentStep]) {
                      handleContinue();
                    }
                  }
                }}
                type={currentStep === 5 ? "submit" : "button"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Waa la socodaa...</span>
                  </div>
                ) : currentStep === 5 ? (
                  "Gudbi"
                ) : (
                  "Sii wad"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
