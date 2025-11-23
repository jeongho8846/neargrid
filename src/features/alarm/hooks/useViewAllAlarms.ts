import { useMutation, useQueryClient } from '@tanstack/react-query';
import { viewAllAlarms } from '../api/getMemberAlarms';
import { ALARM_KEYS } from '../keys/alarmKeys';
import type { AlarmModel } from '../model/AlarmModel';

/**
 * ✅ 모든 알람 읽음 처리 훅 (React Query 사용)
 */
export function useViewAllAlarms() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (currentMemberId: string) => {
      console.log('🔥 [useViewAllAlarms] API 호출:', currentMemberId);
      return viewAllAlarms(currentMemberId);
    },
    onSuccess: (_, currentMemberId) => {
      console.log('✅ [useViewAllAlarms] 성공 - 캐시 업데이트 시작');

      // ✅ 캐시의 알람 데이터를 모두 읽음 상태로 업데이트
      queryClient.setQueryData<AlarmModel[]>(
        ALARM_KEYS.list(currentMemberId),
        oldData => {
          if (!oldData) {
            console.warn('⚠️ [useViewAllAlarms] oldData 없음');
            return oldData;
          }

          console.log(
            '🔄 [useViewAllAlarms] 업데이트 전:',
            oldData.filter(a => !a.viewedByMember).length,
            '개 미열람',
          );

          // 모든 알람의 viewedByMember를 true로 변경
          const newData = oldData.map(alarm => ({
            ...alarm,
            viewedByMember: true,
          }));

          console.log('✅ [useViewAllAlarms] 업데이트 후: 모두 열람 처리');

          return newData;
        },
      );
    },
    onError: error => {
      console.error('❌ [useViewAllAlarms] 실패:', error);
    },
  });

  return {
    markAllAsRead: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
    success: mutation.isSuccess,
  };
}
