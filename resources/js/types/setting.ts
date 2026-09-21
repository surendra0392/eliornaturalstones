/**
 * Setting groups/categories.
 */
export type SettingGroup =
    | 'general'
    | 'branding'
    | 'contact'
    | 'seo'
    | 'social';

/**
 * Supported data types for settings.
 */
export type SettingType =
    | 'text'
    | 'textarea'
    | 'email'
    | 'url'
    | 'media'
    | 'boolean';

/**
 * Structured media reference for logo, favicon, or share card.
 */
export interface SettingMediaValue {
    id?: number | null;
    url?: string | null;
    alt?: string | null;
    name?: string | null;
}

/**
 * Single setting item with schema metadata.
 */
export interface SettingItem {
    key: string;
    value: any;
    group: SettingGroup;
    type: SettingType;
    label: string;
    description?: string | null;
    default?: any;
    is_public: boolean;
    updated_at?: string | null;
}

/**
 * Dictionary of settings grouped by category.
 */
export type CategorizedSettings = Record<SettingGroup, SettingItem[]>;

/**
 * Safe public settings representation shared with Inertia frontend.
 */
export interface PublicSiteSettings {
    site_name?: string;
    brand_descriptor?: string;
    default_location?: string;
    primary_phone?: string;
    primary_email?: string;
    enquiry_phone?: string;
    enquiry_email?: string;
    business_location?: string;
    availability_text?: string;
    default_meta_title?: string;
    default_meta_description?: string;
    default_share_image_id?: any;
    default_social_image_id?: any;
    logo_media_id?: any;
    favicon_media_id?: any;
    social_links?: {
        instagram?: string | null;
        linkedin?: string | null;
        pinterest?: string | null;
    };
    [key: string]: any;
}
