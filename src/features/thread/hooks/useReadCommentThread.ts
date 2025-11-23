import { useQuery } from '@tanstack/react-query';
import { readCommentThread } from '../api/readCommentThread';
import { ThreadComment } from '../model/ThreadCommentModel';
import { memberStorage } from '@/features/member/utils/memberStorage';
import { useEffect, useState } from 'react';

export const useReadCommentThread = (
  commentThreadId: string | undefined,
  threadId: string | undefined,
) => {
  const [memberId, setMemberId] = useState<string | undefined>(undefined);
  const [memberLoaded, setMemberLoaded] = useState(false);

  // ✅ AsyncStorage에서 memberId 가져오기
  useEffect(() => {
    const loadMemberId = async () => {
      const member = await memberStorage.getMember();
      setMemberId(member?.id);
      setMemberLoaded(true);
    };
    loadMemberId();
  }, []);

  return useQuery<ThreadComment | null>({
    queryKey: ['commentThread', commentThreadId, threadId],
    queryFn: () => {
      if (!commentThreadId || !threadId) {
        return Promise.resolve(null);
      }
      console.log('🔥 [useReadCommentThread] API 호출!', {
        commentThreadId,
        threadId,
        memberId,
      });
      return readCommentThread(commentThreadId, threadId, memberId);
    },
    enabled: !!commentThreadId && !!threadId && memberLoaded, // ✅ memberLoaded 확인
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });
};
