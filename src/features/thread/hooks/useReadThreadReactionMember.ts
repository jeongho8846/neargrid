// hooks/useReadThreadReactionMember.ts
import { useEffect, useState } from 'react';
import { readThreadReactionMember } from '../api/readThreadReactionMember';

export const useReadThreadReactionMember = (
  threadId: string,
  currentUserId?: string | null,
) => {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!threadId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await readThreadReactionMember({ threadId, currentUserId });
        setData(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [threadId, currentUserId]);

  return { data, isLoading, error };
};
