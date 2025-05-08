import useSWR from "swr"
import { Task } from "@shared/types/task"

export const useTasks = () => {
  return useSWR<Task[]>('/tasks')
}

export const useTask = (id: number) => {
  return useSWR<Task>(`/tasks/${id}`)
}
