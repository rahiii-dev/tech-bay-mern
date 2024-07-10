
export interface BACKEND_RESPONSE<T = any> {
    type: string;
    message: string;
    extraMessage: {
        title?: string;
        description?: string;
    };
    data: T;
}

export interface PaginationResponse {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number | null;
    page: number;
    prevPage: number | null;
    totalPages: number;
}

export interface BACKEND_ERROR_RESPONSE  {
    type: string;
    message: string;
    extraMessage: {
        title?: string;
        description?: string;
        stack?:string;
    }
}

export function isBackendError(error: any): error is BACKEND_ERROR_RESPONSE {
    return error && typeof error === 'object' &&
        ('type' in error || 'message' in error || 'extraMessage' in error);
}

export type AsyncThunkConfig = {
    rejectValue: BACKEND_ERROR_RESPONSE;
};