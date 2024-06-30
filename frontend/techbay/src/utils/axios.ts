import axios, { AxiosError } from 'axios';
import { SERVER_URL } from './constants';

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
});


// Add a response interceptor
export const setupInterceptor = (toast: any, navigate: any) => {
  axiosInstance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      console.log("Error from interceptot", error);

      if (error.response) {
        const status = error.response.status;

        const { type, extraMessage } = error.response.data as {
          type: string;
          message: string;
          extraMessage: { title: string; description: string };
        }

        if (status >= 500) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with Server.",
            className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
          })
        }

        if (type === "Authorization") {
          toast({
            variant: "destructive",
            title: extraMessage.title,
            description: extraMessage.description,
            className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
          })
          navigate('/login', true)
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
