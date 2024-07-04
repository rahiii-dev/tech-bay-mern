
export interface BACKEND_RESPONSE<T = any> {
    type?: string;
    message?: string;
    extraMessage?: {
        title?: string;
        description?: string;
    };
    data?: T;
}

export interface BACKEND_ERROR_RESPONSE  {
    type?: string;
    message?: string;
    extraMessage?: {
        title?: string;
        description?: string;
    }
}

export function isBackendError(error: any): error is BACKEND_ERROR_RESPONSE {
    return error && typeof error === 'object' &&
        ('type' in error || 'message' in error || 'extraMessage' in error);
}