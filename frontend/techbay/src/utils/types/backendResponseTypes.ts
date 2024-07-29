import { isAxiosError } from "axios";

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

export function isBackendError(error: any): boolean {
    isAxiosError(error)
    return isAxiosError(error) && ('type' in error || 'message' in error || 'extraMessage' in error);
}

export function getBackendError(error: any): BACKEND_ERROR_RESPONSE {
    const data = error.response.data as BACKEND_ERROR_RESPONSE;
    return data
}

export type AsyncThunkConfig = {
    rejectValue: BACKEND_ERROR_RESPONSE;
};