// src/features/map/hooks/useMapThreads.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFetchMapThreads } from './useFetchMapThreads';
import { useMapThreadStore } from '../state/mapThreadStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useLocationStore } from '@/features/location/state/locationStore';
import BottomSheet from '@gorhom/bottom-sheet';

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
  const sheetRef = useRef<BottomSheet | null>(null);

  useEffect(() => {
    if (latitude && longitude && member?.id) {
      loadThreads(searchParams, latitude, longitude);
    }
  }, [latitude, longitude, member?.id]);

  const loadThreads = useCallback(
    async (
      params: SearchParams,
      lat: number,
      lon: number,
      distance?: number,
    ) => {
      if (!member?.id) return;

      try {
        const res = await fetchThreads({
          latitude: lat,
          longitude: lon,
          distance: distance ?? 3000, // ✅ distance 파라미터 받아서 사용, 기본값 3000
          memberId: member.id,
          keyword: params.keyword,
          threadTypes: params.threadTypes,
          recentTimeMinute: params.recentTimeMinute,
          remainTimeMinute: params.remainTimeMinute,
          includePastRemainTime: params.includePastRemainTime,
        });
        setThreads(res);
      } catch (err) {
        console.error('❌ fetchThreads 실패:', err);
      }
    },
    [member?.id, fetchThreads, setThreads],
  );

  // ✅ 마커 클릭 시 바텀시트 올리기
  const handleMarkerPress = useCallback(
    (ids: string[], sheetRef?: React.RefObject<BottomSheet>) => {
      console.log('🎯 마커 클릭:', ids);
      setSelectedIds(ids);
      // ✅ 바텀시트를 50% 위치로 올림
      sheetRef?.current?.snapToIndex(1);
    },
    [],
  );

  const clearFilter = useCallback(() => {
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
