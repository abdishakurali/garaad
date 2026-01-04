import { Target, Rocket, Code, Clock, BookOpen, Briefcase, GraduationCap, Laptop, Palette, BarChart, Database, BrainCircuit } from "lucide-react";
import React from "react";

export const stepTitles = [
    "Waa maxey hadafkaaga?",
    "Maadada aad rabto inaad barato?",
    "Heerkaaga?",
    "Immisa daqiiqo ayad rabtaa inad wax-barato maalin walba?",
    "Fadlan geli Xogtaaga:",
];

export const goals = [
    { id: "build_project", text: "Dhis Project (Web, App, AI)", badge: "Noqo mid wax dhisaya", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
    { id: "learn_programming", text: "Baro Programming", badge: "Baro luqadaha ugu dambeeyay", icon: React.createElement(Code, { className: "w-5 h-5" }) },
    { id: "improve_stem", text: "Kobci STEM (Xisaab, Saynis)", badge: "Aqoon la'aan waa iftiin la'aan", icon: React.createElement(Target, { className: "w-5 h-5" }) },
    { id: "exam_preparation", text: "Imtixaan u diyaar garow", badge: "Hubi guushaada imtixaanka", icon: React.createElement(GraduationCap, { className: "w-5 h-5" }) },
    { id: "career_growth", text: "Kobci Xirfaddaada", badge: "Hel shaqooyin caalami ah", icon: React.createElement(Briefcase, { className: "w-5 h-5" }) },
];

export const topics = [
    { id: "saas_challenge", text: "SaaS & Startup Challenge", badge: "Dhis ganacsi 5 usbuuc gudahood", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
    { id: "web_development", text: "Next.js & Software Development", badge: "Noqo Web Developer xirfadle ah", icon: React.createElement(Laptop, { className: "w-5 h-5" }) },
    { id: "ai_python", text: "Artificial Intelligence & Python", badge: "Baro mustaqbalka tignoolajiyada", icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }) },
    { id: "ui_ux_design", text: "UI/UX & Product Design", badge: "Naqshadeey alaabo qurux badan", icon: React.createElement(Palette, { className: "w-5 h-5" }) },
    { id: "math_engineering", text: "Mathematics & Engineering", badge: "Dhis aasaas adag oo STEM ah", icon: React.createElement(Target, { className: "w-5 h-5" }) },
];

export const topicsByGoal: Record<string, string[]> = {
    build_project: ["saas_challenge", "web_development", "ai_python", "ui_ux_design"],
    learn_programming: ["web_development", "ai_python", "saas_challenge"],
    improve_stem: ["math_engineering", "ai_python"],
    exam_preparation: ["math_engineering", "web_development"],
    career_growth: ["saas_challenge", "web_development", "ai_python", "ui_ux_design"],
};

export const topicLevelsByTopic = {
    "saas_challenge": [
        { title: "Bilow Cusub (Genesis)", description: "Waxaan rabaa inaan ka bilaabo eber ilaa aan ka dhiso MVP ugu horreeya.", example: "Waxaan rabaa inaan barto sida fikrad loogu beddelo SaaS.", level: "beginner", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
        { title: "Dhisidda (Builder)", description: "Waxaan garanayaa aasaaska, waxaan rabaa inaan barto scale-ka iyo users-ka.", example: "Sida loo sameeyo payment integration iyo user management.", level: "intermediate", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
        { title: "Ballaarinta (Scaling)", description: "Waxaan diyaar u ahay inaan ganacsiga gaarsiiyo heer caalami.", example: "Marketing automation iyo database optimization.", level: "advanced", icon: React.createElement(Rocket, { className: "w-5 h-5" }) },
    ],
    web_development: [
        { title: "Barashada Aasaaska", description: "Waxaan rabaa inaan barto HTML, CSS iyo JavaScript aasaaska ah.", example: "Dhisida hal bog (landing page) oo qurxoon.", level: "beginner", icon: React.createElement(Code, { className: "w-5 h-5" }) },
        { title: "Next.js Mastery", description: "Waxaan rabaa inaan dhisidda web apps casri ah oo leh React iyo Next.js.", example: "Dhisida web app leh routing iyo APIs.", level: "intermediate", icon: React.createElement(Laptop, { className: "w-5 h-5" }) },
        { title: "Full-Stack Engineer", description: "Inaan isku xiro Frontend, Backend iyo Database si hufan.", example: "Dhisida dashboard dhamaystiran oo data leh.", level: "advanced", icon: React.createElement(Database, { className: "w-5 h-5" }) },
    ],
    ai_python: [
        { title: "Python Fundamentals", description: "Inaan barto luuqadda ugu caansan AI ee Python.", example: "Qoraalka scripts-ka si loo automate-gareeyo hawlaha.", level: "beginner", icon: React.createElement(Code, { className: "w-5 h-5" }) },
        { title: "Data Analysis", description: "Sida loo falanqeeyo xogta iyo sida loo sawiro (Visualization).", example: "Isticmaalka Pandas iyo Matplotlib.", level: "intermediate", icon: React.createElement(BarChart, { className: "w-5 h-5" }) },
        { title: "AI and Machine Learning", description: "Tababarka moodooyinka AI iyo dhisidda smart apps.", example: "Isticmaalka OpenAI API ama TensorFlow.", level: "advanced", icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }) },
    ],
    ui_ux_design: [
        { title: "Aasaaska Visual Design", description: "Barashada midabada, typography iyo layout-ka.", example: "Naqshadaynta logo iyo user interface fudud.", level: "beginner", icon: React.createElement(Palette, { className: "w-5 h-5" }) },
        { title: "UX Research & Wiring", description: "Sida loo fahmo isticmaalaha iyo dhisidda wireframes.", example: "Dhisida prototype lagu tijaabinayo user flow.", level: "intermediate", icon: React.createElement(BookOpen, { className: "w-5 h-5" }) },
        { title: "Product Design", description: "Dhisida product design system oo dhamaystiran.", example: "Naqshadaynta mobile app oo dhan (High-fidelity).", level: "advanced", icon: React.createElement(Palette, { className: "w-5 h-5" }) },
    ],
    math_engineering: [
        { title: "Foundation Math", description: "Xoojinta aasaaska xisaabta iyo caqliga (Logic).", example: "Aljebra iyo Geometry muhiimka ah.", level: "beginner", icon: React.createElement(Target, { className: "w-5 h-5" }) },
        { title: "Engineering Physics", description: "Fahamka adduunka iyo tignoolajiyada dhexdeeda.", example: "Xallinta mashaakilaadka injineernimada.", level: "intermediate", icon: React.createElement(Target, { className: "w-5 h-5" }) },
        { title: "Calculus & Beyond", description: "Xisaabta sare ee loo isticmaalo NASA iyo AI.", example: "Falanqaynta algorithms-ka kakan.", level: "advanced", icon: React.createElement(Target, { className: "w-5 h-5" }) },
    ],
};

export const learningGoals = [
    { id: "10_min", text: "10 daqiiqo maalin walba", badge: "Talaabo yar, guul weyn", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "20_min", text: "20 daqiiqo maalin walba", badge: "Waqtigaaga si fiican u isticmaal", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "30_min", text: "30 daqiiqo maalin walba", badge: "Adkaysi iyo dadaal", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "60_min", text: "1 saac maalin walba", badge: "Waxbarasho joogto ah", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
];
