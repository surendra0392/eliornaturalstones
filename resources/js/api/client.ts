import type { ApiResponse } from '../types/api';

export class ApiError<T = unknown> extends Error {
    status: number;
    errors?: Record<string, string[]>;
    data?: ApiResponse<T>;

    constructor(message: string, status: number, data?: ApiResponse<T>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        this.errors = data?.errors;
    }
}

/**
 * Standardized typed HTTP client for ELIOR API consumption.
 */
export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers);
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }
    if (typeof FormData !== 'undefined' && options.body instanceof FormData) {
        headers.delete('Content-Type');
    } else if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('X-Requested-With')) {
        headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    const response = await fetch(endpoint, {
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
        throw new ApiError(
            data.message || 'An error occurred during API request.',
            response.status,
            data,
        );
    }

    return data;
}
