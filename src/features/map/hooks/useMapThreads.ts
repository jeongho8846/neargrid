// src/features/map/hooks/useMapThreads.ts

import { useState, useEffect, useCallback } from 'react';
import { useFetchMapThreads } from './useFetchMapThreads';
import { useMapThreadStore } from '../state/mapThreadStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useLocationStore } from '@/features/location/state/locationStore';

type SearchParams = {
  keyword: string;
  threadTypes: string[];
  recentTimeMinute: number;
  remainTimeMinute: number;
  includePastRemainTime: boolean;
};

export const useMapThreads = (searchParams: SearchParams) => {
  const { member } = useCurrentMember();
  const { latitude, longitude } = useLocationStore();
  const { threads, setThreads } = useMapThreadStore();
  const { fetchThreads, loading } = useFetchMapThreads();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ✅ 최초 위치로 쓰레드 로드
  useEffect(() => {
    if (latitude && longitude && member?.id) {
      console.log('📍 [useMapThreads] 현재 위치로 쓰레드 로드:', {
        latitude,
        longitude,
      });
      loadThreads(searchParams, latitude, longitude);
    }
  }, [latitude, longitude, member?.id]);

  const loadThreads = useCallback(
    async (params: SearchParams, lat: number, lon: number) => {
      if (!member?.id) return;

      console.log('🔍 [useMapThreads] loadThreads 호출:', {
        lat,
        lon,
        params,
      });

      try {
        const res = await fetchThreads({
          latitude: lat,
          longitude: lon,
          distance: 3000,
          memberId: member.id,
          keyword: params.keyword,
          threadTypes: params.threadTypes,
          recentTimeMinute: params.recentTimeMinute,
          remainTimeMinute: params.remainTimeMinute,
          includePastRemainTime: params.includePastRemainTime,
        });
        console.log('✅ [useMapThreads] 쓰레드 로드 성공:', res.length, '개');
        setThreads(res);
      } catch (err) {
        console.error('❌ [useMapThreads] fetchThreads 실패:', err);
      }
    },
    [member?.id, fetchThreads, setThreads],
  );

  const handleMarkerPress = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearFilter = useCallback(() => {
    console.log('🗑️ [useMapThreads] 필터 초기화');
    setSelectedIds([]);
  }, []);

  const filteredThreads =
    selectedIds.length > 0
      ? threads.filter(t => selectedIds.includes(t.threadId))
      : threads;

  return {
    threads,
    loading,
    selectedIds,
    filteredThreads,
    handleMarkerPress,
    clearFilter,
    loadThreads,
  };
};
