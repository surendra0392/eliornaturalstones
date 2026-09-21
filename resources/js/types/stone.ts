import type { MediaAsset } from './media';

export interface Collection {
    id: number;
    name: string;
    slug: string;
    tagline?: string | null;
    description?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    sort_order: number;
    is_active: boolean;
    hero_image?: string | null;
    hero_asset?: MediaAsset | null;
    varieties_count?: number;
    varieties?: Variety[];
    created_at?: string;
    updated_at?: string;
}

export interface Variety {
    id: number;
    collection_id: number;
    collection_name?: string;
    name: string;
    slug: string;
    origin?: string | null;
    color_family?: string | null;
    finishes: string[];
    description?: string | null;
    features: string[];
    specifications: Record<string, string>;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    slab_image?: string | null;
    swatch_image?: string | null;
    gallery_images?: MediaAsset[];
    applications?: Application[];
    created_at?: string;
    updated_at?: string;
}

export interface Application {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

export interface Enquiry {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    type?: 'general' | 'trade' | 'sample_request' | 'material_spec';
    material_interest?: string;
    message: string;
    status?: 'pending' | 'reviewed' | 'contacted' | 'archived';
    metadata?: Record<string, unknown>;
}
