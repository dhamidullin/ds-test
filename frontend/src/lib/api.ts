import axios, { AxiosError } from 'axios'
import { Task, TaskCreationData, TaskUpdateData } from '@shared/types/task'
import { getApiBaseUrl } from './config'
import { toast } from 'sonner'

// Define a standard error shape
export interface ApiError {
  message: string;
  status?: number;
}

// Define a standard response shape
interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Function to extract error message
const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Prefer backend error message if available
    return error.response?.data?.message || error.message || 'An unknown API error occurred';
  } else if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// Interceptor for global error logging and notifications
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = getErrorMessage(error);
    const statusCode = error.response?.status;

    console.error('API Error Intercepted:', {
      message: errorMessage,
      status: statusCode,
      url: error.config?.url,
      requestData: error.config?.data,
    });

    // Check if running in the browser before calling toast
    if (typeof window !== 'undefined') {
      // Show toast for common/unexpected client/server errors
      if (!statusCode || statusCode >= 500) {
        toast.error(errorMessage || 'A server error occurred. Please try again later.');
      } else if (!error.response && !error.request) {
        // Handle errors during request setup
        toast.error(`Request setup error: ${errorMessage}`);
      } else if (!error.response) {
        // Handle network errors (no response received)
        toast.error('Network error. Please check your connection.');
      }
      // Potentially add toasts for specific 4xx errors here if desired globally
    }

    // We still reject the promise here, letting the calling function handle the error structure
    return Promise.reject(error);
  }
)

// Updated tasksApi functions
export const tasksApi = {
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    try {
      const response = await api.get<Task[]>('/tasks')
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: { message: getErrorMessage(error), status: (error as AxiosError).response?.status } };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.get<Task>(`/tasks/${id}`)
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: { message: getErrorMessage(error), status: (error as AxiosError).response?.status } };
    }
  },

  create: async (data: TaskCreationData): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.post<Task>('/tasks', data)
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: { message: getErrorMessage(error), status: (error as AxiosError).response?.status } };
    }
  },

  update: async (id: number, data: TaskUpdateData): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.put<Task>(`/tasks/${id}`, data)
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: { message: getErrorMessage(error), status: (error as AxiosError).response?.status } };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/tasks/${id}`)
      return { data: null, error: null }; // Success for delete might just be no error
    } catch (error) {
      return { data: null, error: { message: getErrorMessage(error), status: (error as AxiosError).response?.status } };
    }
  },
}

// Exporting the instance might still be useful for SWR configuration or other direct uses
export default api
