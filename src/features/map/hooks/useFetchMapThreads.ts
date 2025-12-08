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
  commentCount: number;
  memberNickName?: string;
  memberProfileImageUrl?: string;
  threadType?: string;
  description?: string; // ⭐ 추가
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
    console.log('🔍 [useFetchMapThreads] fetchThreads 호출됨');
    console.log('📍 위치 정보:', { latitude, longitude, distance });
    console.log('👤 memberId:', memberId);
    console.log('🔎 검색어:', keyword);
    console.log('🏷️ threadTypes:', threadTypes);
    console.log('⏰ recentTimeMinute:', recentTimeMinute);
    console.log('⏳ remainTimeMinute:', remainTimeMinute);
    console.log('📅 includePastRemainTime:', includePastRemainTime);

    try {
      setLoading(true);
      setError(null);

      console.log('🌐 API 호출 시작...');
      const res = await fetchMapThreads({
        latitude,
        longitude,
        distance,
        memberId,
        keyword,
        timeFilter: recentTimeMinute,
        remainTime: remainTimeMinute,
        threadTypes,
        isIncludePastRemainDateTime: includePastRemainTime,
      });

      console.log('✅ API 응답 받음:', res);
      console.log('📊 응답 데이터 개수:', res.threadResponseSingleDtos?.length ?? 0);

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
            commentCount: t.commentThreadCount ?? 0,
            memberNickName: t.memberNickName,
            memberProfileImageUrl: t.memberProfileImageUrl ?? '',
            threadType: t.threadType ?? '',
            description: t.description ?? '', // ⭐ description 매핑
          } as MapThreadMarkerData;
        })
        .filter(Boolean) as MapThreadMarkerData[];

      console.log('🎯 매핑 완료:', mapped.length, '개');
      console.log('📍 매핑된 threads:', mapped);

      setThreads(mapped);
      setStoreThreads(mapped);
      setNextCursorMark(res.nextCursorMark ?? null);

      return mapped;
    } catch (err: any) {
      console.error('❌ error:', err);
      console.error('❌ error message:', err.message);
      console.error('❌ error stack:', err.stack);
      setError(err);
      return [];
    } finally {
      setLoading(false);
      console.log('🏁 로딩 완료');
    }
  };

  return { threads, loading, error, nextCursorMark, fetchThreads };
};
