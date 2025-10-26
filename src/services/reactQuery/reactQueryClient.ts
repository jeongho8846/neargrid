// src/services/reactQueryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

// ✅ 전역 캐시 이벤트 구독
queryClient.getQueryCache().subscribe(event => {
  // event.type: 'added' | 'updated' | 'removed' 등
  // event.query: Query 객체
  if (event.type === 'updated') {
    const key = event.query.queryKey;
    const data = event.query.state.data;

    console.log('🧠 [ReactQuery 캐시 업데이트 감지]', {
      key,
      data,
    });
  }
});
