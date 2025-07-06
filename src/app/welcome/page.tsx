"use client";
import { useState, useEffect } from "react";
import React from "react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthError,
  selectIsLoading,
  setError as setAuthError,
  setUser,
} from "@/store/features/authSlice";
import AuthService from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import type { AppDispatch } from "@/store";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Network,
  Globe,
  BookOpen,
  Code,
  Brain,
  Puzzle,
  Calculator,
  BarChart,
  Atom,
  Loader2,
  Clock,
  Clock1,
  Clock11,
  Clock12,
  Sunrise,
  Moon,
  SunDim,
  RotateCcw,
} from "lucide-react";
import { useSoundManager } from "@/hooks/use-sound-effects";

// Step titles
const stepTitles = [
  "Waa maxey hadafkaaga ugu weyn?", // What's your top goal?
  "Waqtigee kuugu habboon inad waxbarato?",
  "Maadada aad ugu horayn rabto inaad barato?", // Which topic do you want to explore first?
  "Heerkaaga waxbarashada?", // What's your learning level?
  "Immisa daqiiqo ayad rabtaa inad Wax-barato maalin walba?",
  "Fadlan geli Xogtaaga:", // Please enter your email
];

// Step 1: Initial goal selection
const goals = [
  {
    id: "Horumarinta xirfadaha",
    text: "Horumarinta xirfadaha",
    badge: "Hal adkaanta hal daal ma leh",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    id: "La socoshada cilmiga",
    text: "La socoshada cilmiga",
    badge: "Aqoon la'aan waa iftiin la'aan",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: "Guul dugsiyeedka",
    text: "Guul dugsiyeedka",
    badge: "Wax barashadu waa ilays",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: "Waxbarashada ilmahayga",
    text: "Waxbarashada ilmahayga",
    badge: "Ubadku waa mustaqbalka",
    icon: <Network className="w-5 h-5" />,
  },
  {
    id: "Caawinta ardaydayda",
    text: "Caawinta ardaydayda",
    badge: "Macallin waa waalidka labaad",
    icon: <Brain className="w-5 h-5" />,
  },
];

const learningApproach = [
  {
    id: "morning",
    text: "Aroorti Subaxda inta aan quraacaynayo",
    badge:
      "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ (الزمر: 9)",
    icon: <Sunrise className="w-5 h-5" />,
  },
  {
    id: "afternoon",
    text: " Waqtiga Nasashasha intaan Khadaynayo.",
    badge: "وَقُل رَّبِّ زِدْنِي عِلْمًا (طه: 114)",
    icon: <SunDim className="w-5 h-5" />,
  },
  {
    id: "evening",
    text: "Habeenki ah ka dib cashada ama Kahor intan seexanin",
    badge:
      "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ (المجادلة: 11)",
    icon: <Moon className="w-5 h-5" />,
  },
  {
    id: "flexible",
    text: "Waqti kale oo maalintayda ah",
    badge:
      "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنْتُمْ لَا تَعْلَمُونَ (النحل: 43)",
    icon: <SunDim className="w-5 h-5" />,
  },
];

// Step 3: Topic selection
const topics = [
  {
    id: "math",
    text: "Xisaabta",
    badge: "Xisaab iyo xikmad waa walaalo",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: "data-analysis",
    text: "Xogta Falanqeynta",
    badge: "Fahan xogta iyo muhiimkeeda",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    id: "science",
    text: "Saynis & Injineernimo",
    badge: "Wax kasta cilmi baa lagu gaaraa",
    icon: <Atom className="w-5 h-5" />,
  },
  {
    id: "programming",
    text: "Samaynta Barnaamijyada",
    badge: "Dhis Barnaamijyo tayo leh",
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: "logical-reasoning",
    text: "Fikirka iyo Xalinta",
    badge: "Xalinta mushkiladahu maskaxda ayay koriyaan",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "puzzles",
    text: "Tijaabooyinka (puzzles)",
    badge: "Ku tababar maskaxdaada xalinta mushkiladaha",
    icon: <Puzzle className="w-5 h-5" />,
  },
];

const topicLevelsByTopic: Record<
  string,
  Array<{
    title: string;
    description: string;
    example: string;
    level: string;
    icon: JSX.Element;
  }>
> = {
  math: [
    {
      title: "Xisaabta aasaasiga ah",
      description:
        "Waxaan doonayaa inaan ka bilaabo aasaaska xisaabta si aan u fahmo",
      example: "2,000 + 500 = ?",
      level: "Arithmetic",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Aljebra aasaasiga ah",
      description:
        "Waxaan fahmi karaa isticmaalka xarfaha iyo calaamadaha xisaabta",
      example: "x + 5 = 12",
      level: "Basic Algebra",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Aljebra sare",
      description:
        "Waxaan si fiican u fahmi karaa xiriirka xisaabta iyo jaantuskeeda",
      example: "y = 2x + 1",
      level: "Algebra",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Calculus",
      description: "Waxaan fahmi karaa isbedelka iyo cabbirka xisaabta",
      example: "dy/dx (x²)",
      level: "Calculus",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Xisaabta nolol maalmeedka",
      description: "Waxaan ku dabbiqi karaa xisaabta arrimaha nolol maalmeedka",
      example:
        "Haddii alaab qiimaheedu yahay $50, cashuurta (VAT) 15% tahay, waa maxay qiimaha guud?",
      level: "Real-World Algebra",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Cabbirka iyo qaababka",
      description: "Waxaan fahmi karaa cabbirka iyo qaababka kala duwan",
      example: "Ka hel wareegga goobaab dhererkiisu yahay 10cm",
      level: "Geometry",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Xisaabta xaglaha",
      description: "Waxaan fahmi karaa xiriirka xaglaha iyo dhererkooda",
      example: "Ka hel sin(30°)",
      level: "Trigonometry",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Shaqooyinka xisaabeed",
      description:
        "Waxaan fahmi karaa shaqooyinka xisaabeed iyo isticmaalkooda",
      example: "f(x) = x² + 2x waa maxay qiimaha marka x = 3?",
      level: "Functions",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Tirakoobka iyo suurtogalnimada",
      description: "Waxaan xisaabin karaa celceliska iyo suurtogalnimada xogta",
      example: "Waa maxay celceliska 75, 80, 85, 90, 95?",
      level: "Statistics and Probability",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "Tilmaamayaasha xisaabeed",
      description:
        "Waxaan fahmi karaa tilmaamayaasha xisaabeed iyo isticmaalkooda",
      example: "A = (2,3) iyo B = (4,6) ka hel masaafada u dhexeysa",
      level: "Vectors",
      icon: <Calculator className="w-5 h-5" />,
    },
  ],
  "data-analysis": [
    {
      title: "Ururinta Xogta Aasaasiga ah",
      description:
        "Sida loo ururiyo xog laga soo qaado ilaha kala duwan sida CSV, APIs, ama sahan.",
      example: "Dhexdeeda CSV ka soo dejiso iibkii bishii hore.",
      level: "Basic Data Collection",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      title: "Nadiifinta Xogta (Data Cleaning)",
      description:
        "Ka saarid xogta nuqullada ah, la tacaalidda qiyamka maqan, iyo qaabeynta xogta.",
      example: "Ka saar safafka leh qiimayaal null ah ee column 'da'da'.",
      level: "Data Cleaning",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      title: "Falanqaynta Xogta (Exploratory Data Analysis)",
      description:
        "Soo saaridda jaantusyo, cabbirada celcelis, iyo faahfaahinta qaybinta xogta.",
      example: "Sawir histogram muujinaya qaybinta da'da isticmaaleyaasha.",
      level: "Exploratory Data Analysis",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      title: "Saadaasha Iyo Tijaabinta Istatistikada",
      description:
        "Samaynta tijaabooyinka hypothesis iyo xisaabinta intervals-ka kalsoonida.",
      example: "Fuli t-test si loo barbardhigo celcelisyada laba kooxood.",
      level: "Statistical Inference",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      title: "Hordhac Barashada Mashiinka",
      description: "Dhismo moodallo fudud oo regression iyo classification ah.",
      example: "Tababar regression model si loo saadaaliyo qiimaha guryaha.",
      level: "Intro to Machine Learning",
      icon: <BarChart className="w-5 h-5" />,
    },
  ],

  science: [
    {
      title: "Aasaaska Sayniska",
      description:
        "Fahamka erayada aasaasiga ah sida tamarta, xoog, iyo dhaqdhaqaaq.",
      example: "Sharax sida tamartu u beddesho qaabab kale.",
      level: "Basic Science",
      icon: <Atom className="w-5 h-5" />,
    },
    {
      title: "Bayoolaji (Biology)",
      description:
        "Daraasadda unugyada noolaha, hababka nolosha, iyo ecology-ga.",
      example: "Sharax habka cellular respiration.",
      level: "Biology",
      icon: <Atom className="w-5 h-5" />,
    },
    {
      title: "Kimistari (Chemistry)",
      description:
        "Fahamka isku-darka maaddooyinka, isbeddelka kiimikaad, iyo miisaanka mol-ka.",
      example: "Soo dheelli tir fal-celinta combustion-ka methane.",
      level: "Chemistry",
      icon: <Atom className="w-5 h-5" />,
    },
    {
      title: "Fiisigiska (Physics)",
      description: "Xeerarka dhaq-dhaqaaqa, xoogga, iyo tamarta.",
      example: "Xisaabi acceleration-ka walax 5kg ah marka la saaro xoog 10N.",
      level: "Physics",
      icon: <Atom className="w-5 h-5" />,
    },
    {
      title: "Sayniska Dhulka (Earth Science)",
      description: "Barashada geology, cimilada, iyo juqraafi.",
      example: "Sharax wareegga dhagaxa (rock cycle).",
      level: "Earth Science",
      icon: <Atom className="w-5 h-5" />,
    },
  ],

  programming: [
    {
      title: "Barnaamijyada Aasaasiga ah",
      description: "Isticmaalka variables, shuruudaha if, iyo loops.",
      example: "Qor function dib u celinaysa string.",
      level: "Basic Programming",
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: "Barnaamijyada OOP",
      description: "Abuurista classes, objects, iyo inheritance.",
      example:
        "Samee class matalaya xisaabaad bangi oo leh deposit iyo withdraw.",
      level: "Object-Oriented Programming",
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: "Qaab-dhismeedka Xogta & Algorithms",
      description:
        "Fahamka arrays, linked lists, trees, iyo algorithms sida sorting.",
      example: "Fuli quicksort si aad xog u kala hormariso.",
      level: "Data Structures & Algorithms",
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: "Horumarinta Webka (Web Development)",
      description: "Isticmaalka HTML, CSS, JavaScript, iyo frameworks.",
      example: "Samee bog fudud oo form leh oo loo qurxiyo CSS.",
      level: "Web Development",
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: "APIs & Backend",
      description: "Naqshadeynta REST APIs iyo wada shaqeynta databases.",
      example: "Naqshad endpoint API ah oo maareeya login user.",
      level: "APIs & Backend",
      icon: <Code className="w-5 h-5" />,
    },
  ],

  "logical-reasoning": [
    {
      title: "Fikirka Aasaasiga ah",
      description: "Xallinta syllogism-yada iyo xalinta dhibaatooyinka fudud.",
      example: "Dhisto deducation: All X are Y; Z is X; therefore Z is Y.",
      level: "Deductive Reasoning",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      title: "Fikirka Tarjumida (Inductive Reasoning)",
      description: "Aqoonsiga qaababka iyo saadaasha xogaha.",
      example:
        "Markaad aragto roob rogumaya 5 jeer galab kasta, saadaali marka xiga.",
      level: "Inductive Reasoning",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      title: "Fallacy-ga Loogaga Fogaado",
      description: "Aqoonsashada khaladaadka macquulka ah ee doodaha.",
      example: "Ka hel fallacy-ga 'red herring' ee hadalkan.",
      level: "Logical Fallacies",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      title: "Fikirka Dhaleeceynta (Critical Thinking)",
      description: "Qiimeynta doodaha iyo caddeymaha.",
      example: "Falaar falanqee doodda ku saabsan saameynta climate change.",
      level: "Critical Thinking",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      title: "Xallinta Dhibaatoyinka Casrigga ah",
      description:
        "Isticmaalka hababka macquulka ah ee xalinta dhibaatooyinka adag.",
      example: "Xallinta cadawga casriga ah ee chess.",
      level: "Advanced Reasoning",
      icon: <Brain className="w-5 h-5" />,
    },
  ],

  puzzles: [
    {
      title: "Sudoku",
      description:
        "Buuxi shax 9x9 ah si saf kasta, column kasta, iyo block 3x3 kasta uu yeesho tirooyinka 1-9.",
      example: "Xalliso Sudoku heer fudud oo leh 30 calaamad.",
      level: "Basic Sudoku",
      icon: <Puzzle className="w-5 h-5" />,
    },
    {
      title: "Logic Grid Puzzles",
      description:
        "Habaynta xogaha xog-ogaalnimada si loo xalliyo shuruudaha la isku xiray.",
      example:
        "Ogow qof walba wuxuu cunteeyay xilliga X iyagoo isticmaalaya tilmaamaha.",
      level: "Intermediate Logic Grids",
      icon: <Puzzle className="w-5 h-5" />,
    },
    {
      title: "Crossword Puzzles",
      description:
        "Buuxi calaamadaha iskutallaabta ah iyadoo la isticmaalayo tilmaamaha ereyada.",
      example:
        "Cali talo: Magaalo madax ah oo Faransiis ah (5 xuruuud) => PARIS.",
      level: "Basic Crosswords",
      icon: <Puzzle className="w-5 h-5" />,
    },
    {
      title: "Halxiraalaha Riddles",
      description: "Xallinta halxiraalo ku saleysan macnayaasha iyo sirdoonka.",
      example:
        "Waa maxay shay la jaro laakiin had iyo jeer wuu kordhaa? Jawaab: Jirrid.",
      level: "Riddles",
      icon: <Puzzle className="w-5 h-5" />,
    },
    {
      title: "Kakuro",
      description:
        "Buuxi shax leh wadarta tiirarka iyo safafka iyadoo la raacayo tilmaamaha.",
      example:
        "Shax leh sumad 16: buuxi labo masuul in ay yeeshaan wadarta 16.",
      level: "Advanced Kakuro",
      icon: <Puzzle className="w-5 h-5" />,
    },
  ],
};

const learningGoals = [
  {
    id: "5 daqiiqo?",
    text: "5 daqiiqo?",
    badge: "Talaabo yar, guul weyn",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "10 daqiiqo?",
    text: "10 daqiiqo?",
    badge: "Waqtigaaga si fiican u isticmaal",
    icon: <Clock1 className="w-5 h-5" />,
  },
  {
    id: "15 daqiiqo?",
    text: "15 daqiiqo?",
    badge: "Adkaysi iyo dadaal",
    icon: <Clock11 className="w-5 h-5" />,
  },
  {
    id: "20 daqiiqo?",
    text: "20 daqiiqo?",
    badge: "Waxbarasho joogto ah",
    icon: <Clock12 className="w-5 h-5" />,
  },
];

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, number | string>>({});
  const [selectedTopic, setSelectedTopic] = useState<string>("math");
  const [topicLevels, setTopicLevels] = useState<Record<string, string>>({
    math: "beginner",
    programming: "beginner",
  });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    referralCode: "",
  });
  const [actualError, setActualError] = useState<string>("");
  const { playSound } = useSoundManager();
  const steps = [goals, learningApproach, topics, null, learningGoals];
  const progress = (currentStep / (steps.length + 2)) * 100;

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);
  const { toast } = useToast();

  // Load saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved user data
      const savedUserData = localStorage.getItem('welcome_user_data');
      if (savedUserData) {
        try {
          const parsedUserData = JSON.parse(savedUserData);
          setUserData(parsedUserData);
        } catch (e) {
          console.error('Failed to parse saved user data:', e);
        }
      }

      // Load saved selections
      const savedSelections = localStorage.getItem('welcome_selections');
      if (savedSelections) {
        try {
          const parsedSelections = JSON.parse(savedSelections);
          setSelections(parsedSelections);
        } catch (e) {
          console.error('Failed to parse saved selections:', e);
        }
      }

      // Load saved current step
      const savedStep = localStorage.getItem('welcome_current_step');
      if (savedStep) {
        try {
          const step = parseInt(savedStep);
          if (!isNaN(step) && step >= 0 && step <= steps.length + 1) {
            setCurrentStep(step);
          }
        } catch (e) {
          console.error('Failed to parse saved step:', e);
        }
      }

      // Load saved topic levels
      const savedTopicLevels = localStorage.getItem('welcome_topic_levels');
      if (savedTopicLevels) {
        try {
          const parsedTopicLevels = JSON.parse(savedTopicLevels);
          setTopicLevels(parsedTopicLevels);
        } catch (e) {
          console.error('Failed to parse saved topic levels:', e);
        }
      }

      // Load selected topic
      const savedSelectedTopic = localStorage.getItem('welcome_selected_topic');
      if (savedSelectedTopic) {
        setSelectedTopic(savedSelectedTopic);
      }

      // Check for referral code in URL
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setUserData((prev) => ({ ...prev, referralCode: ref }));
      }
    }
  }, [steps.length]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_user_data', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_selections', JSON.stringify(selections));
    }
  }, [selections]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_current_step', currentStep.toString());
    }
  }, [currentStep]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_topic_levels', JSON.stringify(topicLevels));
    }
  }, [topicLevels]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_selected_topic', selectedTopic);
    }
  }, [selectedTopic]);

  const handleSelect = (value: number | string) => {
    // Play toggle-on sound when an option is selected
    playSound("toggle-on");

    if (currentStep === 2) {
      // Topic selection step
      setSelectedTopic(value as string);
      setSelections((prev) => ({ ...prev, [currentStep]: value }));
    } else if (currentStep === 3) {
      // Level selection step
      // Store the level for the currently selected topic
      setTopicLevels((prev) => ({
        ...prev,
        [selectedTopic]: value as string,
      }));
      setSelections((prev) => ({ ...prev, [currentStep]: value }));
    } else {
      setSelections((prev) => ({ ...prev, [currentStep]: value }));
    }
  };

  const handleContinue = () => {
    // Allow progression through all steps except final submission
    if (currentStep < steps.length + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Fix any types
  interface Option {
    id: string;
    text: string;
    badge: string;
    icon: JSX.Element;
    disabled?: boolean;
  }

  const currentOptions = steps[currentStep] as Option[] | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing errors
    setActualError("");
    dispatch(setAuthError(null));

    try {
      // Validate all data
      if (
        !userData.name.trim() ||
        !userData.email.trim() ||
        !userData.password.trim() ||
        !userData.age.trim()
      ) {
        setActualError("Fadlan buuxi dhammaan xogta");
        return;
      }

      // Check if all selections are made
      if (Object.keys(selections).length < 5) {
        setActualError("Fadlan buuxi dhammaan su'aalaha");
        return;
      }

      // Format the request body
      const signUpData = {
        email: userData.email.trim(),
        password: userData.password.trim(),
        name: userData.name.trim(),
        username: userData.email.trim(),
        age: Number.parseInt(userData.age),
        onboarding_data: {
          goal: String(selections[0]).trim(),
          preferred_study_time: String(selections[1]).trim(),
          topic: String(selections[2]).trim(),
          math_level: String(selections[3]).trim(),
          minutes_per_day: Number.parseInt(String(selections[4]).split(" ")[0]),
        },
        ...(userData.referralCode ? { referral_code: userData.referralCode.trim() } : {}),
      };

      // Call AuthService directly to avoid Redux error handling interference
      const result = await AuthService.getInstance().signUp(signUpData);

      // Update Redux state with the successful result
      if (result?.user) {
        dispatch(setUser({
          ...result.user,
          is_premium: result.user.is_premium || false,
          referral_code: result.user.referral_code,
          referral_points: result.user.referral_points,
          referral_count: result.user.referral_count,
          referred_by: result.user.referred_by,
          referred_by_username: result.user.referred_by_username,
        }));
      }

      // Only redirect if signup was successful
      if (result) {
        // Check if the user's email is already verified
        if (result.user?.is_email_verified) {
          // User is already verified, redirect to appropriate page
          toast({
            variant: "default",
            title: "Waad mahadsantahay!",
            description: "Emailkaaga horey ayaa la xaqiijiyay. Waxaad hadda isticmaali kartaa adeegga.",
          });

          // Clear localStorage data since user is already verified
          if (typeof window !== 'undefined') {
            localStorage.removeItem('welcome_user_data');
            localStorage.removeItem('welcome_selections');
            localStorage.removeItem('welcome_current_step');
            localStorage.removeItem('welcome_topic_levels');
            localStorage.removeItem('welcome_selected_topic');
            localStorage.removeItem('user');
          }

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

          // Store user data in localStorage for email verification page
          localStorage.setItem('user', JSON.stringify({ email: userData.email }));

          router.push(`/verify-email?email=${userData.email}`);
        }
      }
    } catch (error: unknown) {
      console.log("Submission failed:", error);

      // Use the error message from the thrown error (already processed by auth service)
      if (error instanceof Error) {
        setActualError(error.message);
      } else {
        setActualError("Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.");
      }
    }
  };

  // Clear Redux error when component mounts or when user starts over
  useEffect(() => {
    if (authError) {
      dispatch(setAuthError(null));
    }
  }, [authError, dispatch]);

  const handleStartOver = () => {
    // Clear all localStorage data and reset the form
    if (typeof window !== 'undefined') {
      localStorage.removeItem('welcome_user_data');
      localStorage.removeItem('welcome_selections');
      localStorage.removeItem('welcome_current_step');
      localStorage.removeItem('welcome_topic_levels');
      localStorage.removeItem('welcome_selected_topic');
      localStorage.removeItem('user');
    }

    // Reset all state
    setCurrentStep(0);
    setSelections({});
    setSelectedTopic("math");
    setTopicLevels({
      math: "beginner",
      programming: "beginner",
    });
    setUserData({
      name: "",
      email: "",
      password: "",
      age: "",
      referralCode: "",
    });
    setActualError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white px-2 py-6">
      <Card className="w-full max-w-2xl shadow-lg border-0 overflow-hidden px-0">
        <CardContent className="p-0">
          {/* Progress bar */}
          <Progress value={progress} className="h-1 rounded-none" />

          <div className="p-4 md:p-6">
            {/* Step Title and Start Over Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {currentStep <= steps.length
                  ? stepTitles[currentStep]
                  : "Fadlan geli Xogtaada"}
              </h2>
              {currentStep > 0 && (
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Bilow cusub
                </button>
              )}
            </div>

            {/* Display error if it exists */}
            {actualError && (
              <Alert className="mb-6 border-rose-200 bg-rose-50 text-rose-800">
                <AlertTitle className="text-rose-900 flex items-center gap-2 font-medium">
                  Khalad ayaa dhacay <span className="text-xl">⚠️</span>
                </AlertTitle>
                <AlertDescription className="text-rose-800">
                  {actualError}
                </AlertDescription>

              </Alert>
            )}

            {/* Options Grid */}
            {currentStep < 2 && (
              <div className="grid gap-3">
                {currentOptions &&
                  currentOptions.map((option: Option) => (
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
                            "flex items-center p-4 rounded-xl border-2 transition-all",
                            " hover:shadow-sm",
                            selections[currentStep] === option.id
                              ? "border-primary bg-primary/5"
                              : "border-slate-200",
                            option.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <div className="text-primary">{option.icon}</div>
                          </div>
                          <div className="flex-1 text-left px-4 text-sm md:text-base font-medium text-slate-700">
                            {option.text}
                          </div>
                          {option.disabled && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                              Dhowaan
                            </span>
                          )}
                        </div>

                        {selections[currentStep] === option.id && (
                          <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                            {option.badge}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid gap-3">
                {currentOptions &&
                  currentOptions.map((option: Option) => (
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
                            "flex items-center p-4 rounded-xl border-2 transition-all",
                            "hover:border-primary/50 hover:shadow-sm",
                            selections[currentStep] === option.id
                              ? "border-primary bg-primary/5"
                              : "border-slate-200",
                            option.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <div className="text-primary">{option.icon}</div>
                          </div>
                          <div className="flex-1 text-left px-4 text-sm md:text-base font-medium text-slate-700">
                            {option.text}
                          </div>
                          {option.disabled && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                              Dhowaan
                            </span>
                          )}
                        </div>

                        {selections[currentStep] === option.id && (
                          <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                            {option.badge}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {currentStep === 3 && (
              <>
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 font-medium">
                    Heerkaaga{" "}
                    {topics.find((t) => t.id === selectedTopic)?.text ||
                      selectedTopic}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topicLevelsByTopic[selectedTopic].map((level) => (
                    <div key={level.level}>
                      <button
                        onClick={() => handleSelect(level.level)}
                        className="w-full text-left"
                        disabled={isLoading}
                      >
                        <div
                          className={cn(
                            "p-5 rounded-xl border-2 transition-all h-full",
                            "hover:border-primary/50 hover:shadow-sm",
                            topicLevels[selectedTopic] === level.level
                              ? "border-primary bg-primary/5"
                              : "border-slate-200"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                            <div className="text-primary">{level.icon}</div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-slate-800">
                            {level.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-3">
                            {level.description}
                          </p>
                          <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 border border-slate-200">
                            {level.example}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="grid gap-3">
                {learningGoals.map((option: Option) => (
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
                          "flex items-center p-4 rounded-xl border-2 transition-all",
                          "hover:border-primary/50 hover:shadow-sm",
                          selections[currentStep] === option.id
                            ? "border-primary bg-primary/5"
                            : "border-slate-200",
                          option.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                          <div className="text-primary">{option.icon}</div>
                        </div>
                        <div className="flex-1 text-left px-4 text-sm md:text-base font-medium text-slate-700">
                          {option.text}
                        </div>
                        {option.disabled && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                            Dhowaan
                          </span>
                        )}
                      </div>

                      {selections[currentStep] === option.id && (
                        <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
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
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Magacaaga
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Geli magacaaga"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border-slate-200 focus:border-peimary focus:ring-primary/20 text-base md:text-lg"
                      disabled={isLoading}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Magacaaga Danbe
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Geli magacaaga"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border-slate-200 focus:border-primary focus:ring-primary/20"
                      disabled={isLoading}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium text-slate-700"
                    >
                      Da`da
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="5"
                      max="100"
                      placeholder="Geli da'daada"
                      value={userData.age}
                      onChange={(e) =>
                        setUserData({ ...userData, age: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border-slate-200 focus:border-primary focus:ring-primary/20 text-base md:text-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Emailkaaga
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Geli emailkaaga"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-slate-200 focus:border-primary focus:primary/20 text-base md:text-lg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Passwordkaaga
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Geli passwordkaaga"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-slate-200 focus:border-primary focus:primary/20 text-base md:text-lg"
                    disabled={isLoading}
                  />
                </div>
                {/* Referral Code Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="referralCode"
                    className="text-sm font-medium text-slate-700"
                  >
                    Referral Code (optional)
                  </Label>
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="Enter referral code (if any)"
                    value={userData.referralCode || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, referralCode: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-slate-200 focus:border-primary focus:primary/20 text-base md:text-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                className={cn(
                  "w-full rounded-lg py-6 font-semibold transition-colors",
                  currentStep === 6
                    ? " text-white"
                    : currentStep === 5
                      ? userData.email &&
                        userData.password &&
                        userData.name &&
                        userData.age
                        ? " text-white"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : currentStep === 3
                        ? topicLevels[selectedTopic]
                          ? " text-white"
                          : "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : selections[currentStep]
                          ? " text-white"
                          : "bg-slate-200 text-slate-500 cursor-not-allowed",
                  isLoading && "opacity-70 cursor-wait"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentStep === 5) {
                    if (!isLoading) {
                      handleSubmit(e);
                    }
                  } else {
                    if (currentStep === 3 && !topicLevels[selectedTopic]) {
                      // Don't continue if no level is selected for the current topic
                      return;
                    }
                    if (
                      (currentStep !== 3 && selections[currentStep]) ||
                      (currentStep === 3 && topicLevels[selectedTopic])
                    ) {
                      handleContinue();
                    }
                  }
                }}
                type={currentStep === 5 ? "submit" : "button"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
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
        </CardContent>
      </Card>
    </div>
  );
}
