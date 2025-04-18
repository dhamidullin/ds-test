import axios from 'axios'
import { Task, TaskCreationData, TaskUpdateData } from '@shared/types/task'

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development')
    return 'http://localhost:3001/api' // expected location of the backend dev server

  return typeof window === 'undefined' // is server
    ? 'http://backend:3001/api' // backend docker compose service address
    : '/api' // nginx will redirect all incoming /api requests to the backend docker compose service
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

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
