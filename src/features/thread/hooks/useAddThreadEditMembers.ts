import { useMutation } from '@tanstack/react-query';
import { addThreadEditMembers } from '../api/addThreadEditMembers';

export const useAddThreadEditMembers = () => {
  const mutation = useMutation({
    mutationFn: addThreadEditMembers,
  });

  return {
    addEditMembers: async (
      params: Parameters<typeof addThreadEditMembers>[0],
    ) => {
      console.log('[useAddThreadEditMembers] mutate start', params);
      const res = await mutation.mutateAsync(params);
      console.log('[useAddThreadEditMembers] mutate success', res);
      return res;
    },
    isLoading: mutation.isLoading,
  };
};
