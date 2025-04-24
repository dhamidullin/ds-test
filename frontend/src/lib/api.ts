import axios from 'axios'
import { Task, TaskCreationData, TaskUpdateData } from '@shared/types/task'

const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001'
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not set')
  }

  return process.env.NEXT_PUBLIC_API_URL
}

const api = axios.create({
  baseURL: getBaseUrl() + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    })

    return Promise.reject(error)
  }
)

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks')
    return response.data
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`)
    return response.data
  },

  create: async (data: TaskCreationData): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data)
    return response.data
  },

  update: async (id: number, data: TaskUpdateData): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

export default api
