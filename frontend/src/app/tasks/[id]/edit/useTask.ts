import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { tasksApi } from '@/lib/api';

const fetcher = async (taskId: number) => {
  const { data, error } = await tasksApi.getById(taskId);

  if (error) {
    const fetchError: any = new Error(error.message);
    fetchError.status = error.status;
    throw fetchError;
  }

  if (!data) {
    throw new Error('Task data is unexpectedly null.');
  }

  return data;
};

export const useTask = (taskId: number | null) => {
  const router = useRouter();

  const { data: task, error: fetchError, isLoading, mutate } = useSWR(
    taskId ? `${taskId}` : null,
    () => fetcher(taskId!),
    {
      onError: (error) => {
        console.error('Error fetching task:', error);

        if (error?.status === 404) {
          toast.error('This task does not exist');
          router.push('/tasks');
          return;
        }

        toast.error(`Failed to load task: ${error.message}`);
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      refreshInterval: 0,
    }
  );

  return { task, fetchError, isLoading, mutate };
}; 