import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMemberAlarms } from '../api/getMemberAlarms';
import type { AlarmModel, GetMemberAlarmsResp } from '../model/AlarmModel';
import { ALARM_KEYS } from '../keys/alarmKeys';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * ✅ 회원 알람 목록 조회 훅 (React Query 사용)
 */
export function useFetchMemberAlarms(currentMemberId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<AlarmModel[]>({
    queryKey: currentMemberId
      ? ALARM_KEYS.list(currentMemberId)
      : ['alarms', 'none'],
    queryFn: async () => {
      if (!currentMemberId) return [];

      console.log(
        '🔥 [useFetchMemberAlarms] API 호출!',
        new Date().toLocaleTimeString(),
      );

      const res: GetMemberAlarmsResp = await getMemberAlarms({
        current_member_id: currentMemberId,
        paging_state: undefined,
      });

      console.log(
        '✅ [useFetchMemberAlarms] 알람 개수:',
        res.contentAlarmResponseDtos?.length,
      );

      return res.contentAlarmResponseDtos ?? [];
    },
    enabled: !!currentMemberId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });

  // ✅ 화면 포커스될 때마다 refetch
  useFocusEffect(
    useCallback(() => {
      if (currentMemberId) {
        console.log('🔄 [useFetchMemberAlarms] 화면 포커스 - refetch 시작');
        queryClient.invalidateQueries({
          queryKey: ALARM_KEYS.list(currentMemberId),
        });
      }
    }, [currentMemberId, queryClient]),
  );

  return query;
}
