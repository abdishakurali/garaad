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
    title: string;
    tagline: string;
    logo: string;
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
}

// Detailed view startup (full data)
export interface StartupDetail extends StartupListItem {
    description: string;
    images: StartupImage[];
    comments: StartupComment[];
    is_featured: boolean;
    updated_at: string;
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
}

// Vote response
export interface VoteResponse {
    voted: boolean;
    vote_count: number;
}

// Filter types for startup listing
export type StartupFilter = 'trending' | 'new' | 'top' | 'featured';

// UI State for launchpad
export interface LaunchpadState {
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
    submit: "Soo Dir",
    trending: "Trending",
    new: "Cusub",
    top: "Ugu Sarreeya",
    featured: "La Xusay",

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

    // Success/Error
    submitSuccess: "Startup-kaaga waa la diray!",
    voteSuccess: "Waad codeysay!",
    error: "Wax qalad ah ayaa dhacay",
};
