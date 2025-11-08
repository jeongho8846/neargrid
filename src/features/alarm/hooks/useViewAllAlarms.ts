import { useState } from 'react';
import { viewAllAlarms } from '../api/getMemberAlarms';

/**
 * ✅ 모든 알람 읽음 처리 훅 (React Query X)
 */
export function useViewAllAlarms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const markAllAsRead = async (currentMemberId: string) => {
    setLoading(true);
    setError(null);
    try {
      await viewAllAlarms(currentMemberId);
      setSuccess(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { markAllAsRead, loading, error, success };
}
