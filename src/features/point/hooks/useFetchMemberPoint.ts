import { useEffect, useState } from 'react';
import { getMemberPoint } from '../api/getMemberPoint';

export const useFetchMemberPoint = (memberId: string, enabled = true) => {
  const [point, setPoint] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!enabled || !memberId) return;

    const fetchPoint = async () => {
      setLoading(true);
      try {
        const res = await getMemberPoint(memberId);
        setPoint(res?.data ?? 0);
      } catch (err) {
        console.error('❌ [useFetchMemberPoint] fetch failed', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoint();
  }, [enabled, memberId]);

  return { point, loading, error };
};
