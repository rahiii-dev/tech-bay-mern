import { useState, useEffect, useCallback } from 'react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import axios from "../utils/axios";
import { BACKEND_ERROR_RESPONSE } from '../utils/types/backendResponseTypes';

interface AxiosResult<T> {
    data: T | null;
    loading: boolean;
    error: BACKEND_ERROR_RESPONSE | null;
    fetchData: (config?: AxiosRequestConfig) => Promise<T | void>;
}

const useAxios = <T = unknown>(initialConfig: AxiosRequestConfig, immediate = true): AxiosResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(immediate);
    const [error, setError] = useState<BACKEND_ERROR_RESPONSE | null>(null);

    const fetchData = useCallback(async (newConfig?: AxiosRequestConfig) : Promise<T | void> => {
        setLoading(true);
        setError(null);
        try {
            const finalConfig = newConfig || initialConfig;
            const response = await axios<T>(finalConfig);
            setData(response.data);
            return response.data;
        } catch (error : unknown) {
            const axiosError = error as AxiosError<BACKEND_ERROR_RESPONSE>;
            if (axiosError.response) {
                setError(axiosError.response.data);
            } 
        } finally {
            setLoading(false);
        }
    }, [initialConfig]);

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate]);

    return { data, loading, error, fetchData };
};

export default useAxios;
