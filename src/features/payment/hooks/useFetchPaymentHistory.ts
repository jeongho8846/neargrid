import { useEffect, useState, useCallback } from 'react';
import { fetchPaymentHistory } from '../api/fetchPaymentHistory';
import type { PaymentHistory } from '../model/PaymentHistoryModel';

export const useFetchPaymentHistory = (currentMemberId: string) => {
  const [data, setData] = useState<PaymentHistory[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (!currentMemberId || loading) return;
      try {
        setLoading(true);
        const res = await fetchPaymentHistory(currentMemberId, pageToLoad);
        setData(prev =>
          pageToLoad === 0
            ? res.paymentResponseDtos
            : [...prev, ...res.paymentResponseDtos],
        );
        setHasNext(res.hasNext);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [currentMemberId, loading],
  );

  // 첫 페이지 로드
  useEffect(() => {
    loadPage(0);
  }, [currentMemberId]);

  // 다음 페이지 로드 트리거
  const loadNext = () => {
    if (hasNext && !loading) {
      setPage(prev => {
        const next = prev + 1;
        loadPage(next);
        return next;
      });
    }
  };

  const refetch = () => {
    setPage(0);
    loadPage(0);
  };

  return { data, loading, error, loadNext, hasNext, refetch };
};
