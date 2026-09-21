export interface ApiResponse<T = unknown> {
    data: T;
    meta?: Record<string, unknown>;
    message?: string | null;
    errors?: Record<string, string[]>;
}

export interface PaginatedMeta {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
}
