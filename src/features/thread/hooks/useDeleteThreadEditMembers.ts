import { useMutation } from '@tanstack/react-query';
import { deleteThreadEditMembers } from '../api/deleteThreadEditMembers';

export const useDeleteThreadEditMembers = () => {
  const mutation = useMutation({
    mutationFn: deleteThreadEditMembers,
  });

  return {
    deleteEditMembers: async (
      params: Parameters<typeof deleteThreadEditMembers>[0],
    ) => {
      console.log('[useDeleteThreadEditMembers] mutate start', params);
      const res = await mutation.mutateAsync(params);
      console.log('[useDeleteThreadEditMembers] mutate success', res);
      return res;
    },
    isLoading: mutation.isLoading,
  };
};
