export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    body: string;
    cover: string | null;           // bridge URL, preferred
    cover_image_url: string | null; // same value, kept for compat
    author_name: string;
    published_at: string;
    tags: Tag[];
    excerpt: string;
    meta_description?: string;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}
