import axios, { AxiosError } from 'axios';

export const apiInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const message = error.response?.data?.error || error.message;
    return Promise.reject(new Error(message));
  },
);