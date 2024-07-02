import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SERVER_URL } from './constants';
import { toast } from '../components/ui/use-toast';
import { BACKEND_ERROR_RESPONSE } from './types';
import { REFRESH_TOKEN_URL } from './urls/authUrls';

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Add a response interceptor
export const setupInterceptor = (navigate: any) => {
  axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response) {
        const errordData = error.response.data as BACKEND_ERROR_RESPONSE

        if(errordData.type === 'Token' && !originalRequest?._retry){ 
          originalRequest._retry = true;
          try {
            await axiosInstance.post(REFRESH_TOKEN_URL);
            return axiosInstance(originalRequest);
      
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
          
        }

        if (errordData.type === "Authorization") {
          toast({
            variant: "destructive",
            title: errordData?.extraMessage?.title || "Autherization Error",
            description: errordData?.extraMessage?.description || '',
            className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
          })
          navigate('/login', true)
        }

        if(errordData.type === "Server"){
          console.log("SERVER_ERROR: ",errordData);
          toast({
            variant: "destructive",
            title: errordData?.extraMessage?.title || "Uh oh! Something went wrong.",
            description: errordData?.extraMessage?.description || "There was a problem with Server.",
            className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
          })
        }


      } else if (error.request) {
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "No response received from the server. Please try again later.",
          className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
        })
        
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
          className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
        })
      }
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
