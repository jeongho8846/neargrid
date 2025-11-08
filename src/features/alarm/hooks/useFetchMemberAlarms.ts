import { useEffect, useState } from 'react';
import { getMemberAlarms } from '../api/getMemberAlarms';
import type { AlarmModel, GetMemberAlarmsResp } from '../model/AlarmModel';

/**
 * ✅ 회원 알람 목록 조회 훅 (React Query X)
 */
export function useFetchMemberAlarms(currentMemberId?: string) {
  const [data, setData] = useState<AlarmModel[]>([]);
  const [nextPagingState, setNextPagingState] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlarms = async (pagingState?: string) => {
    if (!currentMemberId) return;
    setLoading(true);
    setError(null);
    try {
      const res: GetMemberAlarmsResp = await getMemberAlarms({
        current_member_id: currentMemberId,
        paging_state: pagingState,
      });
      setData(res.contentAlarmResponseDtos ?? []);
      setNextPagingState(res.nextPagingState);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, [currentMemberId]);

  return { data, loading, error, nextPagingState, refetch: fetchAlarms };
}
