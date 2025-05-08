import { Task, TaskCreationData, TaskUpdateData } from "@shared/types/task";
import useSWRMutation from "swr/mutation";
import api, { tasksApi } from "./api";
import { useTask, useTasks } from "./queries";
import { useSWRConfig } from "swr";

export const useCreateTask = () => {
  const tasksQuery = useTasks()

  return useSWRMutation<Task, Error, string, TaskCreationData>(
    '/api/tasks/create-trigger',
    async (_key, { arg }) => {
      const apiResponse = await tasksApi.create(arg);

      if (apiResponse.error) {
        const err = new Error(apiResponse.error.message || 'Failed to create task') as any;
        err.status = apiResponse.error.status;
        throw err;
      }
      if (!apiResponse.data) {
        throw new Error("Task creation succeeded but no data was returned.");
      }
      return apiResponse.data;
    },
    {
      onError(error, _key, _config) {
        console.error('Error in useCreateTask mutation:', error)
      },
      onSuccess(_data, _key, _config) {
        tasksQuery.mutate()
      }
    }
  );
}

export interface UpdateTaskArgs {
  id: number;
  payload: TaskUpdateData;
}

export const useUpdateTask = (id: number) => {
  const taskByIdQuery = useTask(id);

  return useSWRMutation<Task, Error, string, UpdateTaskArgs>(
    '/api/tasks/update-trigger',
    async (_key, { arg }) => {
      const { id, payload } = arg;
      const apiResponse = await api.put<Task>(`/tasks/${id}`, payload);

      if (apiResponse.status >= 400) {
        const err = new Error(apiResponse.statusText || 'Failed to update task') as any;
        err.status = apiResponse.status;
        throw err;
      }

      if (!apiResponse.data) {
        throw new Error("Task update operation succeeded but no data was returned.");
      }

      return apiResponse.data;
    },
    {
      onSuccess: (updatedTask, _mutationKey, _config) => {
        if (!updatedTask || !updatedTask.id) return;
        taskByIdQuery.mutate();
      },
      onError: (error) => {
        console.error('Error in useUpdateTask mutation:', error);
      }
    }
  );
};