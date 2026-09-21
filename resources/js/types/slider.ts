export type SliderStatus = 'published' | 'draft';
export type TransitionType = 'fade' | 'slide' | 'crossfade' | 'cinematic';
export type OverlayType = 'none' | 'subtle' | 'medium' | 'gradient' | 'dark';
export type ContentAlignment = 'left' | 'center' | 'right';
export type ContentWidth = 'compact' | 'standard' | 'wide' | 'full';
export type VerticalPosition = 'top' | 'center' | 'bottom';

export type LayerType =
    | 'eyebrow'
    | 'heading'
    | 'description'
    | 'cta'
    | 'image'
    | 'decorative_shape'
    | 'spacer';

export interface SliderSettings {
    autoplay?: boolean;
    autoplay_interval?: number; // ms
    pause_on_hover?: boolean;
    loop?: boolean;
    navigation?: boolean;
    pagination?: boolean;
    progress_bar?: boolean;
    keyboard_nav?: boolean;
    touch_swipe?: boolean;
    default_transition?: TransitionType;
    transition_duration?: number; // seconds
}

export interface LayerContent {
    text?: string;
    secondary_text?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    color?: string;
    font_family?: 'Playfair Display' | 'Montserrat';
    primary_label?: string;
    primary_url?: string;
    primary_variant?: 'primary' | 'secondary' | 'outline';
    secondary_label?: string;
    secondary_url?: string;
    secondary_variant?: 'primary' | 'secondary' | 'outline';
    src?: string;
    alt?: string;
    shape_type?: 'line' | 'box' | 'dot';
    width?: string;
    height?: string;
}

export interface LayerPositioning {
    horizontal_align?: 'left' | 'center' | 'right';
    x_offset?: number | string;
    y_offset?: number | string;
    max_width?: string;
    opacity?: number;
    scale?: number;
    rotation?: number;
}

export interface LayerAnimation {
    entrance?:
        | 'fade-up'
        | 'fade-down'
        | 'fade-in'
        | 'slide-left'
        | 'slide-right'
        | 'scale-in'
        | 'clip-reveal'
        | 'none';
    duration?: number; // seconds
    delay?: number; // seconds
    ease?: string;
    exit?: 'fade' | 'slide-down' | 'scale-out' | 'none';
}

export interface LayerResponsivePreset {
    is_visible?: boolean;
    font_size?: string;
    x_offset?: number | string;
    y_offset?: number | string;
}

export interface LayerResponsive {
    desktop?: LayerResponsivePreset;
    tablet?: LayerResponsivePreset;
    mobile?: LayerResponsivePreset;
}

export interface SlideLayer {
    id: number;
    slide_id: number;
    type: LayerType;
    name: string;
    sort_order: number;
    z_index: number;
    is_visible: boolean;
    content?: LayerContent;
    positioning?: LayerPositioning;
    animation?: LayerAnimation;
    responsive?: LayerResponsive;
    created_at?: string;
    updated_at?: string;
}

export interface Slide {
    id: number;
    slider_id: number;
    title: string;
    status: SliderStatus;
    sort_order: number;
    duration?: number | null; // ms
    transition?: TransitionType | null;
    background_type: 'image' | 'color';
    background_image?: string | null;
    background_color?: string | null;
    background_position?: string;
    background_size?: string;
    overlay_type: OverlayType;
    overlay_opacity: number;
    content_alignment: ContentAlignment;
    content_width: ContentWidth;
    vertical_position: VerticalPosition;
    parallax_enabled: boolean;
    parallax_intensity: number;
    settings?: Record<string, unknown> | null;
    layers_count?: number;
    layers?: SlideLayer[];
    created_at?: string;
    updated_at?: string;
}

export interface Slider {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    status: SliderStatus;
    settings?: SliderSettings;
    slides_count?: number;
    published_slides_count?: number;
    slides?: Slide[];
    created_at?: string;
    updated_at?: string;
}
