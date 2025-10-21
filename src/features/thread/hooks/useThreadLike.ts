import { useCallback, useRef, useState } from 'react';
// TODO: 실제 API 연결
// import { likeThreadApi, unlikeThreadApi } from '../api/likeApi';

type Params = {
  threadId: string;
  initialLiked?: boolean;
  initialCount?: number;
  listParams?: any[]; // React Query 캐시 패치 시 사용할 예정
};

export const useThreadLike = ({
  threadId,
  initialLiked = false,
  initialCount = 0,
}: Params) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const inflight = useRef(false);

  const toggleLike = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;

    const prevLiked = liked;
    const prevCount = likeCount;

    // optimistic
    const nextLiked = !prevLiked;
    const nextCount = prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1;
    setLiked(nextLiked);
    setLikeCount(nextCount);

    console.log(
      'threadId:',
      threadId,
      'nextLiked:',
      nextLiked,
      'nextCount:',
      nextCount,
    );
    try {
      // 실제 API
      // if (prevLiked) await unlikeThreadApi(threadId);
      // else await likeThreadApi(threadId);
      // TODO: 여기서 React Query 캐시 패치 함수 호출 가능
    } catch (e) {
      // 롤백
      setLiked(prevLiked);
      setLikeCount(prevCount);
      // AppToast.error(i18n.t('error.like'));
    } finally {
      inflight.current = false;
    }
  }, [threadId, liked, likeCount]);

  return { liked, likeCount, toggleLike, inflight: inflight.current };
};
