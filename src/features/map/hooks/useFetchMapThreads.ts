import { useState } from 'react';
import { fetchMapThreads } from '../api/fetchMapThreads';
import { useMapThreadStore } from '../state/mapThreadStore';

export type MapThreadMarkerData = {
  threadId: string;
  latitude: number;
  longitude: number;
  markerImageUrl?: string;
  contentImageUrls?: string[];
  reactionCount: number;
  memberNickName?: string;
  memberProfileImageUrl?: string;
};

export const useFetchMapThreads = () => {
  const [threads, setThreads] = useState<MapThreadMarkerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursorMark, setNextCursorMark] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { setThreads: setStoreThreads } = useMapThreadStore();

  const fetchThreads = async ({
    latitude,
    longitude,
    distance = 3000,
    memberId,
    keyword = '',
    threadTypes = [],
    recentTimeMinute = 0,
    remainTimeMinute = '',
    includePastRemainTime = '',
  }: {
    latitude: number;
    longitude: number;
    distance?: number;
    memberId: string;
    keyword?: string;
    threadTypes?: string[];
    recentTimeMinute?: number;
    remainTimeMinute?: number | string;
    includePastRemainTime?: boolean | string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchMapThreads({
        latitude,
        longitude,
        distance,
        memberId,
        keyword, // ✅ 전달
        timeFilter: recentTimeMinute,
        remainTime: remainTimeMinute,
        threadTypes,
        isIncludePastRemainDateTime: includePastRemainTime,
      });

      const mapped = (res.threadResponseSingleDtos ?? [])
        .map((t: any) => {
          const lat = t.gpsLocationResponseDto?.latitude;
          const lon = t.gpsLocationResponseDto?.longitude;
          if (!lat || !lon) return null;

          return {
            threadId: t.threadId,
            latitude: lat,
            longitude: lon,
            markerImageUrl: t.markerImageUrl || t.contentImageUrls?.[0],
            contentImageUrls: t.contentImageUrls ?? [],
            reactionCount: t.reactionCount ?? 0,
            memberNickName: t.memberNickName,
            memberProfileImageUrl: t.memberProfileImageUrl ?? '',
          } as MapThreadMarkerData;
        })
        .filter(Boolean) as MapThreadMarkerData[];

      setThreads(mapped);
      setStoreThreads(mapped);
      setNextCursorMark(res.nextCursorMark ?? null);

      console.log('📍 [useFetchMapThreads] 반환된 threads:', mapped.length);
      return mapped;
    } catch (err: any) {
      console.error('[useFetchMapThreads] error:', err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { threads, loading, error, nextCursorMark, fetchThreads };
};
