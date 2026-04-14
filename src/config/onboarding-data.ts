import {
    Target, Rocket, Code, Clock, BookOpen, Briefcase,
    Laptop, BarChart, Database,
    BrainCircuit, Lightbulb, Wrench,
    Sparkles, RefreshCw, Globe, User, DollarSign, AlertCircle,
} from "lucide-react";
import React from "react";

// ─────────────────────────────────────────────
// STEP TITLES (legacy indices for profile learning-path UI: 0–3)
// ─────────────────────────────────────────────
export const stepTitles = [
    "Maxaad doonaysaa inaad gaarto?",
    "Maxaad doonaysaa inaad dhisato?",
    "Heerkaaga hadda?",
    "Waqti intee le'eg ayaad toddobaadkii si dhab ah u bixin kartaa?",
    "Ma haysaa fikrad mashruuc?",
    "Waxyar ayaa kuu dhiman.",
];

// ─────────────────────────────────────────────
// STEP 1 — GOALS
// ─────────────────────────────────────────────
export const goals = [
    {
        id: "get_hired",
        text: "Inaad shaqo tech ah hesho",
        subtitle: "Junior, Full-Stack, ama AI engineer",
        badge: "Hel shaqadaadii ugu horreysay ee developer-nimo — ha ahaato junior, Full-Stack, ama AI engineer.",
        icon: React.createElement(Briefcase, { className: "w-5 h-5" }),
    },
    {
        id: "build_product",
        text: "Inaad alaab adigu leedahay dhisato",
        subtitle: "App, SaaS, ama mashruuc lacag keena",
        badge: "Ka bilow fikrad ilaa aad ka gaarto alaab dhab ah oo dadku lacag ka bixiyaan.",
        icon: React.createElement(Rocket, { className: "w-5 h-5" }),
    },
    {
        id: "freelance",
        text: "Inaad bixiso adeeg madax-bannaan",
        subtitle: "Freelance ama consulting",
        badge: "Hel macaamiil, ka shaqee meel kasta, oo lacag ku hel sida aad adigu doonayso.",
        icon: React.createElement(Laptop, { className: "w-5 h-5" }),
    },
    {
        id: "level_up",
        text: "Inaad kor u qaaddo xirfaddaada",
        subtitle: "Ku dar qalab cusub shaqadaada",
        badge: "Si qoto dheer u baro — Next.js, AI, Cloud, iyo Backend.",
        icon: React.createElement(Target, { className: "w-5 h-5" }),
    },
    {
        id: "understand_tech",
        text: "Inaad tech-ga fahanto si aad ganacsigaaga si fiican u maamusho",
        subtitle: "Si fiican u xakamee ama u maamul",
        badge: "U baahni maysid inaad wax kasta code-gareyso — kaliya fahanka muhiimka ah si aad hoggaamin u samayso.",
        icon: React.createElement(Lightbulb, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// STEP 2 — EXPERIENCE (welcome wizard)
// ─────────────────────────────────────────────
export const experienceOptions = [
    {
        id: "first_time",
        text: "Waa markaygii ugu horreysay",
        badge: "Wali hal xariiq oo code ah ma qorin — eber ayaan ka bilaabayaa.",
        icon: React.createElement(Sparkles, { className: "w-5 h-5" }),
    },
    {
        id: "tried_before",
        text: "Horey ayaan isugu dayay laakiin waan iska dhaafay",
        badge: "Waxaan bilaabay casharro YouTube ah ama koorso — laakiin ma dhammaystirin.",
        icon: React.createElement(RefreshCw, { className: "w-5 h-5" }),
    },
    {
        id: "knows_basics",
        text: "Aasaaska waan aqaan",
        badge: "HTML, CSS, iyo JavaScript waan fahamsanahay laakiin wali wax dhab ah ma dhisin.",
        icon: React.createElement(BookOpen, { className: "w-5 h-5" }),
    },
    {
        id: "can_build",
        text: "Waxyaabo waan dhison karaa",
        badge: "Horey ayaan wax u sameeyay oo u soo saaray — waxaan rabaa inaan intaas ka sii fogaado.",
        icon: React.createElement(Wrench, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// STEP 3 — BARRIERS (conditional: experience === tried_before)
// ─────────────────────────────────────────────
export const barrierOptions = [
    {
        id: "english",
        text: "Wax kasta waxay ahaayeen Ingiriis",
        badge: "Waxay igu qasabtay inaan luuqadda turjunto, xirfaddana isla markaas barto.",
        icon: React.createElement(Globe, { className: "w-5 h-5" }),
    },
    {
        id: "alone",
        text: "Keligay ayaan wax baranayay",
        badge: "Ma jirin qof aan wax weydiiyo markaan steck-garo. Markay adkaatay ayaan iska dhaafay.",
        icon: React.createElement(User, { className: "w-5 h-5" }),
    },
    {
        id: "expensive",
        text: "Aad ayay qaali u ahayd",
        badge: "Bootcamps-ka iyo koorsooyinka waxay ku kacayeen lacag badan iyadoo aan wax damaanad ah jirin.",
        icon: React.createElement(DollarSign, { className: "w-5 h-5" }),
    },
    {
        id: "life",
        text: "Nolosha ayaa igu soo mashquushay",
        badge: "Shaqo, qoys, iyo mas'uuliyado kale — waqtiga ayaa igu yaraaday.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "overwhelming",
        text: "Aad ayay u badneyd",
        badge: "Macluumaad aad u badan, maan aqoon meel aan ka bilaabo ama waxa aan xoogga saaro.",
        icon: React.createElement(AlertCircle, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// LEARNING TRACKS
// ─────────────────────────────────────────────
export const topics = [
    {
        id: "fullstack_mern",
        text: "Full-Stack MERN Development",
        badge: "Dhis web apps oo dhammaystiran bilow ilaa dhammaad — waa xirfadda hadda loogu doonista badan yahay.",
        icon: React.createElement(Database, { className: "w-5 h-5" }),
    },
    {
        id: "nextjs_frontend",
        text: "Next.js & Frontend Engineering",
        badge: "Dhis interface qurux badan oo dheereeya — waxa ay dadku dhab ahaan arkaan ee ay taabtaan.",
        icon: React.createElement(Laptop, { className: "w-5 h-5" }),
    },
    {
        id: "ai_python",
        text: "AI, Machine Learning & Python",
        badge: "Dhis apps caqli badan — waa xirfadda adduunka ugu xoogga badan hadda.",
        icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }),
    },
    {
        id: "saas_startup",
        text: "SaaS Business & Product Building",
        badge: "Dhis alaab, hel macaamiil, lacagna ku samee — safarka dhammaystiran ee founder-nimada.",
        icon: React.createElement(Rocket, { className: "w-5 h-5" }),
    },
    {
        id: "backend_apis",
        text: "Backend Engineering & APIs",
        badge: "Dhis mashiinka — server-yada, databases-ka, iyo caqliga ka dambeeya wax kasta.",
        icon: React.createElement(Wrench, { className: "w-5 h-5" }),
    },
];

/** Recommended track badge (Step 5): only for first_time | tried_before */
export const recommendedTopicByGoal: Record<string, string> = {
    get_hired: "fullstack_mern",
    build_product: "saas_startup",
    freelance: "nextjs_frontend",
    level_up: "ai_python",
    understand_tech: "saas_startup",
};

// ─────────────────────────────────────────────
// TRACK → GOAL MAPPING
// ─────────────────────────────────────────────
export const topicsByGoal: Record<string, string[]> = {
    get_hired: ["fullstack_mern", "nextjs_frontend", "backend_apis", "ai_python"],
    build_product: ["saas_startup", "fullstack_mern", "nextjs_frontend", "ai_python"],
    freelance: ["nextjs_frontend", "fullstack_mern", "backend_apis", "ai_python"],
    level_up: ["ai_python", "backend_apis", "nextjs_frontend", "fullstack_mern"],
    understand_tech: ["saas_startup", "ai_python", "nextjs_frontend"],
};

// ─────────────────────────────────────────────
// LEVELS PER TRACK
// ─────────────────────────────────────────────
export const topicLevelsByTopic: Record<string, Array<{
    title: string;
    description: string;
    example: string;
    level: string;
    icon: React.ReactElement;
}>> = {

    fullstack_mern: [
        {
            title: "MERN Foundations",
            description: "Baro HTML, CSS, JavaScript iyo Node.js aasaaska — ka dib waxaad dhisi doontaa server iyo webpage koowaad.",
            example: "Dhis to-do app leh Node backend iyo React frontend.",
            level: "beginner",
            icon: React.createElement(Code, { className: "w-5 h-5" }),
        },
        {
            title: "Full-Stack Apps",
            description: "Isku xir React, Express, MongoDB iyo REST API — dhis app la geli karo dhabta ah.",
            example: "Dhis e-commerce app leh auth, cart iyo database.",
            level: "intermediate",
            icon: React.createElement(Database, { className: "w-5 h-5" }),
        },
        {
            title: "Production-Ready Engineer",
            description: "Docker, CI/CD, testing, performance — deploy gareey apps heer shaqo ah oo xowli ah.",
            example: "Deploy SaaS app leh Stripe payments iyo role-based auth.",
            level: "advanced",
            icon: React.createElement(Wrench, { className: "w-5 h-5" }),
        },
    ],

    nextjs_frontend: [
        {
            title: "React & Next.js Basics",
            description: "Components, props, state, routing — dhis pages xawli leh oo qurxoon.",
            example: "Dhis portfolio website ama blog leh Next.js App Router.",
            level: "beginner",
            icon: React.createElement(Laptop, { className: "w-5 h-5" }),
        },
        {
            title: "Dynamic UI & APIs",
            description: "Server Components, data fetching, Tailwind, Shadcn/UI — dhis apps leh xiriir live ah.",
            example: "Dhis dashboard xiriira REST API oo data muujiya.",
            level: "intermediate",
            icon: React.createElement(Laptop, { className: "w-5 h-5" }),
        },
        {
            title: "Senior Frontend Engineer",
            description: "Performance optimization, TypeScript strict, testing, monorepos — code heer enterprise ah.",
            example: "Dhis design system leh Storybook iyo automated tests.",
            level: "advanced",
            icon: React.createElement(Code, { className: "w-5 h-5" }),
        },
    ],

    ai_python: [
        {
            title: "Python Essentials",
            description: "Variables, functions, loops, files — baro Python si aad u bilaabato automating iyo data.",
            example: "Qor script ka akhridaya CSV oo warqad email ah soo saara.",
            level: "beginner",
            icon: React.createElement(Code, { className: "w-5 h-5" }),
        },
        {
            title: "Data & APIs",
            description: "Pandas, NumPy, REST APIs, visualization — falanqayn xog iyo ka shaqaynta APIs dibadda.",
            example: "Falanqayn xog sales ah oo samee dashboard Chart.js leh.",
            level: "intermediate",
            icon: React.createElement(BarChart, { className: "w-5 h-5" }),
        },
        {
            title: "AI & LLM Engineering",
            description: "OpenAI API, LangChain, RAG, fine-tuning, vector databases — dhis apps intelligent ah.",
            example: "Dhis AI chatbot leh RAG ka akhridaya PDF-yaada ganacsigaaga.",
            level: "advanced",
            icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }),
        },
    ],

    saas_startup: [
        {
            title: "Idea → MVP",
            description: "Validation, problem framing, no-code tools, landing page — xaqiiji fikradda ka hor intaadan code galin.",
            example: "Dhis landing page leh waitlist oo hel 100 emails usbuuc gudahood.",
            level: "beginner",
            icon: React.createElement(Lightbulb, { className: "w-5 h-5" }),
        },
        {
            title: "Build & Monetize",
            description: "Stripe, auth, onboarding, pricing — dhis MVP lacag keenaya oo la gaarsiin karo users.",
            example: "Wax ku bixi Stripe Checkout iyo heerka Bilaash (weligeed bilaash).",
            level: "intermediate",
            icon: React.createElement(Rocket, { className: "w-5 h-5" }),
        },
        {
            title: "Scale & Grow",
            description: "Churn reduction, growth loops, hiring, metrics — ka shaqee kordhinaanta oo gaarsii $10K MRR.",
            example: "Dhis referral program iyo automated onboarding emails.",
            level: "advanced",
            icon: React.createElement(BarChart, { className: "w-5 h-5" }),
        },
    ],

    backend_apis: [
        {
            title: "Server & Database Basics",
            description: "Node.js, Express, SQL/PostgreSQL, REST — dhis API fudud oo xiriira database.",
            example: "Dhis CRUD API users iyo posts leh JWT auth.",
            level: "beginner",
            icon: React.createElement(Database, { className: "w-5 h-5" }),
        },
        {
            title: "Advanced APIs & Auth",
            description: "GraphQL, OAuth 2.0, Redis caching, webhooks — dhis backend adag oo heer lacag leh.",
            example: "Wax ku bixi OAuth Google/GitHub iyo rate limiting.",
            level: "intermediate",
            icon: React.createElement(Wrench, { className: "w-5 h-5" }),
        },
        {
            title: "Cloud & DevOps",
            description: "AWS/GCP, Docker, Kubernetes, monitoring — deploy gareey oo maamul infrastructure heer enterprise ah.",
            example: "Deploy microservices leh Docker Compose iyo auto-scaling.",
            level: "advanced",
            icon: React.createElement(Database, { className: "w-5 h-5" }),
        },
    ],
};

// ─────────────────────────────────────────────
// TIME COMMITMENT (weekly hours; IDs unchanged)
// ─────────────────────────────────────────────
export const learningGoals = [
    {
        id: "15_min",
        text: "1-2 saacadood toddobaadkii",
        badge: "Waxyar halkan iyo halkaas — nolol mashquul ah ayaan leeyahay.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "30_min",
        text: "3-5 saacadood toddobaadkii",
        badge: "Dhowr fadhi toddobaadkii — tan waan maareyn karaa.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "60_min",
        text: "6-10 saacadood toddobaadkii",
        badge: "Arrintan si dhab ah ayaan u rabaa — waqti ayaan u gooynayaa.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "90_min",
        text: "10+ saacadood toddobaadkii",
        badge: "Si buuxda ayaan ugu heellanahay — tani waa muhiimaddayda koowaad hadda.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// PROJECT IDEA
// ─────────────────────────────────────────────
export const projectIdeaOptions = [
    {
        id: "yes_clear",
        text: "Haa — fikrad cad ayaan haystaa",
        badge: "Si dhab ah ayaan u garanayaa waxa aan rabo inaan dhiso.",
        description: "",
        icon: React.createElement(Rocket, { className: "w-5 h-5" }),
    },
    {
        id: "yes_vague",
        text: "Qiyaas ahaan — wali si fiican iima cadda",
        badge: "Fikrad guud ayaan haystaa laakiin wali ma hubon.",
        description: "",
        icon: React.createElement(Lightbulb, { className: "w-5 h-5" }),
    },
    {
        id: "no_idea",
        text: "Maya — mid iisoo jeedi",
        badge: "Iga caawi inaan helo project ku habboon hadafkayga iyo aqoontayda.",
        description: "",
        icon: React.createElement(BookOpen, { className: "w-5 h-5" }),
    },
];

export const projectIdeaPrompt = {
    label: "Ku qor project-gaaga hal weedh:",
    placeholder:
        "Tusaale: Waxaan rabaa inaan dhiso aalad ka caawisa freelancer-rada Soomaaliyeed inay diraan qaansheegadka (invoices)...",
    helpText:
        "Hal weedh ayaa kugu filan. Casharrada waxaan u qaabayn doonnaa fikradaada.",
};
