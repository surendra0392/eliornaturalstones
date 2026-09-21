export interface MediaAsset {
    id?: number;
    url: string;
    thumb?: string;
    medium?: string;
    large?: string;
    alt?: string;
    focalPoint?: { x: number; y: number };
}

export interface MediaDimensions {
    width: number | null;
    height: number | null;
    formatted: string | null;
}

export interface AssociatedEntity {
    type: 'collection' | 'variety' | 'page';
    id: number;
    name: string;
    slug: string;
    parent_collection?: string;
    slot?: string;
}

export interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    size_formatted: string;
    url: string;
    thumb_url: string;
    large_url: string;
    dimensions: MediaDimensions;
    alt_text: string | null;
    collection_name: string;
    model_type: string;
    model_id: number;
    is_associated: boolean;
    associated_entity: AssociatedEntity | null;
    created_at: string;
    updated_at: string;
}

export interface MediaPaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface CanonicalCollectionRef {
    id: number;
    name: string;
    slug: string;
}

export interface VarietyRef {
    id: number;
    name: string;
    slug: string;
    collection_id: number;
}
