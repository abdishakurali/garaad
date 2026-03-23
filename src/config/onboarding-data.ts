import {
    Target, Rocket, Code, Clock, BookOpen, Briefcase,
    Laptop, BarChart, Database,
    BrainCircuit, Lightbulb, Wrench
} from "lucide-react";
import React from "react";

// ─────────────────────────────────────────────
// STEP TITLES
// ─────────────────────────────────────────────
// 6 steps: goal → track → level → time → project idea → personal info
export const stepTitles = [
    "Maxaad rabtaa inaad gaarto?",           // 1. What outcome do you want?
    "Xirfadee kugu haboon ?", // 2. Which track fits you?
    "Heerkaaga hadda?",                       // 3. Current level
    "Immisa waqti ayad u haysataa maalin kastaa?", // 4. Daily time
    "Ma leedahay fikrad project ah?",         // 5. Project idea (new)
    "Geli macluumaadkaaga:",                  // 6. Personal info
];

// ─────────────────────────────────────────────
// STEP 1 — GOALS  (outcome-first framing)
// ─────────────────────────────────────────────
export const goals = [
    {
        id: "get_hired",
        text: "Hel Shaqo Tech ah",
        badge: "Junior Developer, Full-Stack, AI Engineer — dhis CV iyo portfolio kuu furaya albaabada shaqo caalamiga ah.",
        icon: React.createElement(Briefcase, { className: "w-5 h-5" }),
    },
    {
        id: "build_product",
        text: "Dhis ganacsi ad adiga ledahay",
        badge: "Ka fikradda ilaa MVP — dhis product dhabta ah oo kasbo lacagtaada ugu horreysa.",
        icon: React.createElement(Rocket, { className: "w-5 h-5" }),
    },
    {
        id: "freelance",
        text: "Bilaaw Freelancing",
        badge: "Noqo contractor madax-bannaan — hel clients, samee projects, kasbo lacag ka baaxad kasta oo adduunka ah.",
        icon: React.createElement(Laptop, { className: "w-5 h-5" }),
    },
    {
        id: "level_up",
        text: "Kor u Qaad Xirfadahaaga",
        badge: "Horumar shaqadaada hadda — baro Next.js, AI, Cloud ama Backend si aad uga qiimo batido shaqadaada.",
        icon: React.createElement(Target, { className: "w-5 h-5" }),
    },
    {
        id: "understand_tech",
        text: "Faham Tech si Aad Ganacsiga Uga Maamusho",
        badge: "Entrepreneur ama founder ah? Faham xirfad farsamo si aad kooxdaada uga xukunto oo go'aamo firfircoon gasho.",
        icon: React.createElement(Lightbulb, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// STEP 2 — LEARNING TRACKS
// ─────────────────────────────────────────────
export const topics = [
    {
        id: "fullstack_mern",
        text: "Full-Stack MERN Development",
        badge: "MongoDB, Express, React, Node.js — dhis web apps dhamaystiran oo la geli karo shaqo ama la iibsan karo.",
        icon: React.createElement(Database, { className: "w-5 h-5" }),
    },
    {
        id: "nextjs_frontend",
        text: "Next.js & Frontend Engineering",
        badge: "React, Next.js, Tailwind, TypeScript — dhis UIs casri ah oo xawli leh oo suuqa ku tartama.",
        icon: React.createElement(Laptop, { className: "w-5 h-5" }),
    },
    {
        id: "ai_python",
        text: "AI, Machine Learning & Python",
        badge: "Python, LLMs, OpenAI API, LangChain — dhis apps intelligent ah oo automating leh oo mustaqbalka saabsan.",
        icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }),
    },
    {
        id: "saas_startup",
        text: "SaaS Business & Product Building",
        badge: "Fikrad → MVP → Lacag — baro sida loo dhiso, la iibsado oo loo ballaarinno SaaS product dhabta ah.",
        icon: React.createElement(Rocket, { className: "w-5 h-5" }),
    },
    {
        id: "backend_apis",
        text: "Backend Engineering & APIs",
        badge: "REST, GraphQL, Databases, Auth, Deployment — dhis infrastructure adag oo apps kugu taageerta.",
        icon: React.createElement(Wrench, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// TRACK → GOAL MAPPING  (which tracks show per goal)
// ─────────────────────────────────────────────
export const topicsByGoal: Record<string, string[]> = {
    get_hired: ["fullstack_mern", "nextjs_frontend", "backend_apis", "ai_python"],
    build_product: ["saas_startup", "fullstack_mern", "nextjs_frontend", "ai_python"],
    freelance: ["nextjs_frontend", "fullstack_mern", "backend_apis", "ai_python"],
    level_up: ["ai_python", "backend_apis", "nextjs_frontend", "fullstack_mern"],
    understand_tech: ["saas_startup", "ai_python", "nextjs_frontend"],
};

// ─────────────────────────────────────────────
// STEP 3 — LEVELS PER TRACK
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
// STEP 4 — DAILY TIME COMMITMENT
// ─────────────────────────────────────────────
export const learningGoals = [
    {
        id: "15_min",
        text: "15 daqiiqo — Cashar maalinlaha ah",
        badge: "Ku habboon kuwa mashquulsan — talaabo yar maalin kasta ayaa guul weyn ku keenta.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "30_min",
        text: "30 daqiiqo — Waxbarasho joogto ah",
        badge: "Xawli ku meelmaraya — baro xirfad cusub 3 bilood gudahood.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "60_min",
        text: "1 saac — Xirfadle xuubsibixi ah",
        badge: "Noqo developer shaqo-diyaar ah 6 bilood gudahood.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
    {
        id: "90_min",
        text: "1.5 saac+ — Dhis si degdeg ah",
        badge: "Heerkan waxaad ku dhisi kartaa MVP dhabta ah 4–6 usbuuc gudahood.",
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// STEP 5 — PROJECT IDEA  (NEW STEP)
// ─────────────────────────────────────────────
// This drives curriculum personalisation: if student has an idea,
// lessons and projects revolve around building *their* product.
export const projectIdeaOptions = [
    {
        id: "yes_clear",
        text: "Haa — Fikrad cad ayaan leeyahay",
        badge: "Aad! Waxbarashadaada waxaan ku haynaa project-kaaga si aad si dhakhso ah ugu dhisin.",
        description: "Gabagabo onboarding-ka waxaad geli doontaa sharaxaad kooban oo projectgaaga ah.",
        icon: React.createElement(Rocket, { className: "w-5 h-5" }),
    },
    {
        id: "yes_vague",
        text: "Wax baan hayaa — laakiin weli kama cadda",
        badge: "Waa caadi — casharyadu kaa caawinayaan inaad sifayso oo aad xaqiijiso fikraddaada.",
        description: "Waxaan ku tusin doonaa sida validation loo sameeyo ka hor dhisid.",
        icon: React.createElement(Lightbulb, { className: "w-5 h-5" }),
    },
    {
        id: "no_idea",
        text: "Maya — Waxaan rabaa inad ii soo jeediso",
        badge: "Dhib ma aha — waxaanu ku siineynaa project ideas la xiriira xirfadahaaga iyo hadafkaaga.",
        description: "Curriculum default waxaan kuu dooran doonaa project faa'iido leh oo heer-kaaga ku habboon.",
        icon: React.createElement(BookOpen, { className: "w-5 h-5" }),
    },
];

// ─────────────────────────────────────────────
// STEP 5b — PROJECT IDEA TEXT INPUT (conditional)
// Shown only when user picks "yes_clear" or "yes_vague"
// ─────────────────────────────────────────────
export const projectIdeaPrompt = {
    label: "Sharax project-kaaga:",
    placeholder: "Tusaale: Waxaan dhisi rabaa SaaS tool u ah freelancers si ay invoices u maamulaan...",
    helpText: "Hal jumlad oo ku filan. Casharyada iyo projects-ka waxaan ku habayn doonaa fikraddaada.",
};