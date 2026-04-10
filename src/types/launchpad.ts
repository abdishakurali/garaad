// Launchpad Feature Types - Startup Showcase

export interface StartupCategory {
    id: string;
    name: string;
    name_somali: string;
    description: string;
    icon: string;
    sequence: number;
    startups_count: number;
}

export interface StartupMaker {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
}

export interface StartupImage {
    id: string;
    image: string;
    image_url?: string;
    caption: string;
    order: number;
    uploaded_at: string;
}

export interface StartupComment {
    id: string;
    author: StartupMaker;
    content: string;
    created_at: string;
    updated_at: string;
    is_edited: boolean;
}

// List view startup (lightweight)
export interface StartupListItem {
    id: string;
    slug?: string;
    title: string;
    tagline: string;
    logo: string;
    logo_url?: string;
    website_url: string;
    maker: StartupMaker;
    category: StartupCategory | null;
    tech_stack: string[];
    is_hiring: boolean;
    is_built_on_garaad: boolean;
    vote_count: number;
    user_has_voted: boolean;
    maker_completed_courses: string[];
    comments_count: number;
    created_at: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    video_url?: string;
    images: StartupImage[];
}


// Detailed view startup (full data)
export interface StartupDetail extends StartupListItem {
    description: string;
    images: StartupImage[];
    comments: StartupComment[];
    is_featured: boolean;
    updated_at: string;
    pitch_data: Record<string, {
        en: string;
        so: string;
        answer: string;
    }>;
}


// Create/Update startup form data
export interface StartupFormData {
    title: string;
    tagline: string;
    description: string;
    website_url: string;
    logo: File | null;
    category_id: string | null;
    tech_stack: string[];
    is_hiring: boolean;
    pitch_data: Record<string, string>;
    github_url: string;
    linkedin_url: string;
    twitter_url: string;
    facebook_url: string;
    instagram_url: string;
    video_url: string;
    images: File[];
}




// Vote response
export interface VoteResponse {
    voted: boolean;
    vote_count: number;
}

// Filter types for startup listing (and project listing)
export type StartupFilter = 'trending' | 'new' | 'top' | 'featured' | 'this_week';

// —— Project (lightweight submission) ——
export interface ProjectComment {
    id: number;
    author_username: string;
    content: string;
    created_at: string;
    is_edited: boolean;
}

export interface Project {
    id: number;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    logo_url: string;
    website_url: string;
    repo_url: string;
    tech_stack: string[];
    course: number | null;
    course_title: string | null;
    maker_username: string;
    vote_count: number;
    has_voted: boolean;
    status: 'draft' | 'published';
    comments: ProjectComment[];
    comments_count: number;
    created_at: string;
}

export interface ProjectFormData {
    title: string;
    tagline: string;
    description: string;
    logo_url: string;
    website_url: string;
    repo_url: string;
    tech_stack: string[];
    course: number | null;
}

// Filter types for project listing
type ProjectSort = 'trending' | 'new' | 'top' | 'this_week';

// UI State for launchpad
interface LaunchpadState {
    startups: StartupListItem[];
    categories: StartupCategory[];
    selectedCategory: string | null;
    currentFilter: StartupFilter;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
}

// Tech stack options (commonly used)
export const TECH_STACK_OPTIONS = [
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'Django',
    'FastAPI',
    'MongoDB',
    'PostgreSQL',
    'Firebase',
    'Supabase',
    'AWS',
    'Vercel',
    'Flutter',
    'React Native',
    'Swift',
    'Kotlin',
    'TypeScript',
    'GraphQL',
    'Redis',
    'Docker',
] as const;

    // Somali UI text for launchpad
export const LAUNCHPAD_UI_TEXT = {
    // Navigation
    launchpad: "Launchpad",
    startups: "Startups",
    projects: "Projects",
    submit: "Soo Dir",
    trending: "Trending",
    new: "Cusub",
    top: "Ugu Sarreeya",
    featured: "La Xusay",
    thisWeek: "Todobaadkan",
    submitProject: "Mashruuc Cusub Soo Gudbi",

    // Actions
    upvote: "Codee",
    share: "La Wadaag",
    visit: "Booqo",
    comment: "Faallo",
    submitStartup: "Soo dir Startup-kaaga",

    // Form labels
    title: "Magaca",
    tagline: "Qoraal Gaaban",
    description: "Sharaxaad",
    website: "Website",
    logo: "Logo",
    category: "Nooca",
    techStack: "Tech Stack",
    hiring: "Waxaan raadineynaa shaqaale",
    screenshots: "Sawirro",

    // Badges
    builtOnGaraad: "Lagu Dhisay Garaad",
    hiringBadge: "Waan Shaqaalaynayaa",

    // Empty states
    noStartups: "Ma jiraan Startups weli",
    beFirst: "Noqo qofka ugu horreeya ee soo dirta Startup!",
    noProjects: "Wali mashruuc ma soo gudbinin.",
    startCourseBuild: "Bilow koorsadaada, mashruucaaga dhis!",
    myProjects: "Mashruucyadayda",
    viewAll: "Dhammaan arag",

    // Success/Error
    submitSuccess: "Startup-kaaga waa la diray!",
    voteSuccess: "Waad codeysay!",
    error: "Wax qalad ah ayaa dhacay",
};
