import { useState, useCallback } from 'react';
import { fetchFootPrintContents } from '../api/fetchFootPrintContents';

/**
 * ✅ useFetchFootPrintContents
 * - FootPrintScreen에서 발자국 데이터를 가져오는 훅
 */
export const useFetchFootPrintContents = () => {
  const [loading, setLoading] = useState(false);

  const fetchContents = useCallback(
    async ({
      memberId,
      startDateTime,
      endDateTime,
    }: {
      memberId: string;
      startDateTime: string;
      endDateTime: string;
    }) => {
      try {
        setLoading(true);
        const data = await fetchFootPrintContents({
          memberId,
          startDateTime,
          endDateTime,
        });
        return data;
      } catch (err) {
        console.error('❌ useFetchFootPrintContents 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetchContents, loading };
};
