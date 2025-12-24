import { Activity, Globe, BookOpen, Network, Brain, Calculator, BarChart, Atom, Code, Puzzle, Sunrise, SunDim, Moon, Clock, Clock1, Clock11, Clock12 } from "lucide-react";
import React from "react";

export const stepTitles = [
    "Waa maxey hadafkaaga ugu weyn?",
    "Waqtigee kuugu habboon inad waxbarato?",
    "Maadada aad ugu horayn rabto inaad barato?",
    "Heerkaaga waxbarashada?",
    "Immisa daqiiqo ayad rabtaa inad Wax-barato maalin walba?",
    "Fadlan geli Xogtaaga:",
];

export const goals = [
    { id: "Horumarinta xirfadaha", text: "Horumarinta xirfadaha", badge: "Hal adkaanta hal daal ma leh", icon: React.createElement(Activity, { className: "w-5 h-5" }) },
    { id: "La socoshada cilmiga", text: "La socoshada cilmiga", badge: "Aqoon la'aan waa iftiin la'aan", icon: React.createElement(Globe, { className: "w-5 h-5" }) },
    { id: "Guul dugsiyeedka", text: "Guul dugsiyeedka", badge: "Wax barashadu waa ilays", icon: React.createElement(BookOpen, { className: "w-5 h-5" }) },
    { id: "Waxbarashada ilmahayga", text: "Waxbarashada ilmahayga", badge: "Ubadku waa mustaqbalka", icon: React.createElement(Network, { className: "w-5 h-5" }) },
    { id: "Caawinta ardaydayda", text: "Caawinta ardaydayda", badge: "Macallin waa waalidka labaad", icon: React.createElement(Brain, { className: "w-5 h-5" }) },
];

export const learningApproach = [
    { id: "morning", text: "Aroorti Subaxda inta aan quraacaynayo", badge: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ (الزمر: 9)", icon: React.createElement(Sunrise, { className: "w-5 h-5" }) },
    { id: "afternoon", text: " Waqtiga Nasashasha intaan Khadaynayo.", badge: "وَقُل رَّبِّ زِدْنِي عِلْمًا (طه: 114)", icon: React.createElement(SunDim, { className: "w-5 h-5" }) },
    { id: "evening", text: "Habeenki ah ka dib cashada ama Kahor intan seexanin", badge: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ (المجادلة: 11)", icon: React.createElement(Moon, { className: "w-5 h-5" }) },
    { id: "flexible", text: "Waqti kale oo maalintayda ah", badge: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنْتُمْ لَا تَعْلَمُونَ (النحل: 43)", icon: React.createElement(SunDim, { className: "w-5 h-5" }) },
];

export const topics = [
    { id: "math", text: "Xisaabta", badge: "Xisaab iyo xikmad waa walaalo", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
    { id: "data-analysis", text: "Xogta Falanqeynta", badge: "Fahan xogta iyo muhiimkeeda", icon: React.createElement(BarChart, { className: "w-5 h-5" }) },
    { id: "science", text: "Saynis & Injineernimo", badge: "Wax kasta cilmi baa lagu gaaraa", icon: React.createElement(Atom, { className: "w-5 h-5" }) },
    { id: "programming", text: "Samaynta Barnaamijyada", badge: "Dhis Barnaamijyo tayo leh", icon: React.createElement(Code, { className: "w-5 h-5" }) },
    { id: "logical-reasoning", text: "Fikirka iyo Xalinta", badge: "Xalinta mushkiladahu maskaxda ayay koriyaan", icon: React.createElement(Brain, { className: "w-5 h-5" }) },
    { id: "puzzles", text: "Tijaabooyinka (puzzles)", badge: "Ku tababar maskaxdaada xalinta mushkiladaha", icon: React.createElement(Puzzle, { className: "w-5 h-5" }) },
];

export const topicLevelsByTopic = {
    math: [
        { title: "Xisaabta aasaasiga ah", description: "Waxaan doonayaa inaan ka bilaabo aasaaska xisaabta si aan u fahmo", example: "2,000 + 500 = ?", level: "Arithmetic", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
        { title: "Aljebra aasaasiga ah", description: "Waxaan fahmi karaa isticmaalka xarfaha iyo calaamadaha xisaabta", example: "x + 5 = 12", level: "Basic Algebra", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
        { title: "Aljebra sare", description: "Waxaan si fiican u fahmi karaa xiriirka xisaabta iyo jaantuskeeda", example: "y = 2x + 1", level: "Algebra", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
        { title: "Calculus", description: "Waxaan fahmi karaa isbedelka iyo cabbirka xisaabta", example: "dy/dx (x²)", level: "Calculus", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
        { title: "Xisaabta nolol maalmeedka", description: "Waxaan ku dabbiqi karaa xisaabta arrimaha nolol maalmeedka", example: "Haddii alaab qiimaheedu yahay $50, cashuurta (VAT) 15% tahay, waa maxay qiimaha guud?", level: "Real-World Algebra", icon: React.createElement(Calculator, { className: "w-5 h-5" }) },
    ],
    "data-analysis": [
        { title: "Ururinta Xogta Aasaasiga ah", description: "Sida loo ururiyo xog laga soo qaado ilaha kala duwan", example: "CSV ka soo dejiso iibkii bishii hore.", level: "Basic", icon: React.createElement(BarChart, { className: "w-5 h-5" }) },
    ],
    science: [
        { title: "Aasaaska Sayniska", description: "Fahamka erayada aasaasiga ah", example: "Sharax sida tamartu u beddesho qaabab kale.", level: "Basic", icon: React.createElement(Atom, { className: "w-5 h-5" }) },
    ],
    programming: [
        { title: "Barnaamijyada Aasaasiga ah", description: "Isticmaalka variables, shuruudaha if, iyo loops.", example: "Qor function dib u celinaysa string.", level: "Basic", icon: React.createElement(Code, { className: "w-5 h-5" }) },
    ],
    "logical-reasoning": [
        { title: "Fikirka Aasaasiga ah", description: "Xallinta syllogism-yada", example: "Dhisto deducation: All X are Y; Z is X; therefore Z is Y.", level: "Basic", icon: React.createElement(Brain, { className: "w-5 h-5" }) },
    ],
    puzzles: [
        { title: "Sudoku", description: "Buuxi shax 9x9 ah", example: "Xalliso Sudoku heer fudud.", level: "Basic", icon: React.createElement(Puzzle, { className: "w-5 h-5" }) },
    ],
};

export const learningGoals = [
    { id: "5 daqiiqo?", text: "5 daqiiqo?", badge: "Talaabo yar, guul weyn", icon: React.createElement(Clock, { className: "w-5 h-5" }) },
    { id: "10 daqiiqo?", text: "10 daqiiqo?", badge: "Waqtigaaga si fiican u isticmaal", icon: React.createElement(Clock1, { className: "w-5 h-5" }) },
    { id: "15 daqiiqo?", text: "15 daqiiqo?", badge: "Adkaysi iyo dadaal", icon: React.createElement(Clock11, { className: "w-5 h-5" }) },
    { id: "20 daqiiqo?", text: "20 daqiiqo?", badge: "Waxbarasho joogto ah", icon: React.createElement(Clock12, { className: "w-5 h-5" }) },
];
