
export interface BACKEND_RESPONSE  {
    type?: string;
    message?: string;
    extraMessage?: {
        title?: string;
        description?: string;
    }
    data?: any;
}

export interface BACKEND_ERROR_RESPONSE  {
    type?: string;
    message?: string;
    extraMessage?: {
        title?: string;
        description?: string;
    }
}
