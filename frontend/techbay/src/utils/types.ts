
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
