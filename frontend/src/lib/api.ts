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

    const isBrowser = typeof window !== 'undefined'

    if (isBrowser) {
      if (!statusCode || statusCode >= 500) {
        toast.error(errorMessage || 'A server error occurred. Please try again later.');
      } else if (!error.response && !error.request) {
        toast.error(`Request setup error: ${errorMessage}`);
      } else if (!error.response) {
        toast.error('Network error. Please check your connection.');
      }
    }

    return Promise.reject(error);
  }
)

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

export default api
