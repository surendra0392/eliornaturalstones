/**
 * Versioned API Route Endpoints for ELIOR Natural Stones
 */
export const API_ENDPOINTS = {
    v1: {
        collections: '/api/v1/collections',
        collection: (slug: string) => `/api/v1/collections/${slug}`,
        varieties: '/api/v1/varieties',
        variety: (slug: string) => `/api/v1/varieties/${slug}`,
        page: (slug: string) => `/api/v1/pages/${slug}`,
        enquiries: '/api/v1/enquiries',
        admin: {
            media: '/api/v1/admin/media',
            mediaItem: (id: number) => `/api/v1/admin/media/${id}`,
            assignMedia: (id: number) => `/api/v1/admin/media/${id}/assign`,
            pages: '/api/v1/admin/pages',
            pageItem: (id: number) => `/api/v1/admin/pages/${id}`,
            publishPage: (id: number) => `/api/v1/admin/pages/${id}/publish`,
            enquiries: '/api/v1/admin/enquiries',
            enquiryItem: (id: number) => `/api/v1/admin/enquiries/${id}`,
            enquiryStatus: (id: number) =>
                `/api/v1/admin/enquiries/${id}/status`,
            settings: '/api/v1/admin/settings',
        },
    },
} as const;
