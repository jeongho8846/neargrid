// src/features/map/hooks/useFetchMapThreads.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMapThreads } from '../api/fetchMapThreads';
import { mapServerThread } from '@/features/thread/model/ThreadModel';
import { Thread } from '@/features/thread/model/ThreadModel';

type Params = {
  latitude?: number | null;
  longitude?: number | null;
  memberId?: string;
  enabled?: boolean;
  distance?: number;
};

export const useFetchMapThreads = (params: Params) => {
  const { enabled = true } = params;

  return useQuery<Thread[]>({
    queryKey: ['mapThreads', params],
    queryFn: async () => {
      const res = await fetchMapThreads({
        latitude: params.latitude ?? 0,
        longitude: params.longitude ?? 0,
        memberId: params.memberId ?? '',
        distance: params.distance ?? 3000,
      });
      return res.threads.map(mapServerThread);
    },
    enabled:
      enabled &&
      !!params.memberId &&
      typeof params.latitude === 'number' &&
      typeof params.longitude === 'number',
    staleTime: 10_000,
  });
};
