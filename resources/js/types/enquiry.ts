/**
 * Canonical lifecycle statuses for ELIOR architectural enquiries.
 */
export type EnquiryStatus = 'pending' | 'in_progress' | 'responded' | 'closed';

/**
 * Standardized Admin Enquiry data representation.
 */
export interface AdminEnquiry {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    project_space?: string | null;
    enquiry_type: string;
    type: string;
    collection?: string | null;
    material_interest?: string | null;
    estimated_requirement?: string | null;
    message: string;
    status: EnquiryStatus;
    ip_address?: string | null;
    user_agent?: string | null;
    metadata?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
    formatted_date?: string;
    time_ago?: string;
}

/**
 * Counts of enquiries across statuses.
 */
export interface EnquiryCounts {
    total: number;
    pending: number;
    in_progress: number;
    responded: number;
    closed: number;
}

/**
 * Pagination and metrics metadata for enquiries list.
 */
export interface EnquiryPaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    counts?: EnquiryCounts;
}

/**
 * Filter parameters for enquiry queries.
 */
export interface EnquiryFilters {
    search: string;
    status: EnquiryStatus | 'all';
    type: string;
    collection: string;
    page: number;
    per_page?: number;
}
