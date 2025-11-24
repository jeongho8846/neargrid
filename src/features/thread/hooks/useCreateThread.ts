import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { apiContents } from '@/services/apiService';
import type { Asset } from 'react-native-image-picker';
import { THREAD_KEYS } from '../keys/threadKeys';
import type { Thread } from '../model/ThreadModel';
import type { FetchFeedThreadsResult } from './useFetchFeedThreads';

type CreateThreadParams = {
  currentMember: any;
  description: string;
  threadType: string;
  bounty_point: string;
  remain_in_minute: string;
  region: string | null;
  images: Asset[];
  latitude: number;
  longitude: number;
  altitude?: number;
  navigation: any;
};

/**
 * 🎭 임시 Thread 객체 생성
 * Optimistic Update를 위해 서버 응답 전에 사용
 */
function createOptimisticThread(
  params: CreateThreadParams,
  tempId: string,
): Thread {
  const now = new Date().toISOString();

  return {
    threadId: tempId,
    threadType: params.threadType,
    description: params.description,
    contentImageUrls: params.images.map(img => img.uri || ''),
    videoUrls: [],

    memberId: params.currentMember.id,
    memberNickName: params.currentMember.nickName || '',
    memberProfileImageUrl: params.currentMember.profileImageUrl || '',

    createDatetime: now,
    updateDatetime: now,
    distanceFromCurrentMember: 0,

    popularityScore: 0,
    popularityScoreRecent: 0,

    latitude: params.latitude,
    longitude: params.longitude,

    reactedByCurrentMember: false,
    reactionCount: 0,
    commentThreadCount: 0,

    available: true,
    private: false,
    hiddenDueToReport: false,

    markerImageUrl: '',

    bountyPoint: params.bounty_point ? Number(params.bounty_point) : null,
    expireDateTime: null,
    remainDateTime: null,

    childThreadCount: 0,
    childThreadDirectCount: 0,
    childThreadWritableByOthers: false,

    donationPointReceivedCount: 0,
    depth: 0,
  };
}

export function useCreateThread() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: CreateThreadParams) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 [REQUEST] Create Thread 시작');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const formData = new FormData();

      // ✅ 필수 필드
      formData.append('member_id', params.currentMember.id);
      formData.append('thread_type', params.threadType);
      formData.append('description', params.description);

      // ✅ Nullable 필드들 - 0 (false) 으로 설정
      formData.append('Nullable_bounty_point', '0');
      formData.append('Nullable_remain_in_minute', '0');
      formData.append('Nullable_is_hub_thread', '0');
      formData.append('Nullable_is_child_thread_writable_by_others', '0');
      formData.append('Nullable_is_private', '0');
      formData.append('Nullable_is_map_replaces_image', '1');
      formData.append('Nullable_latitude', String(params.latitude));
      formData.append('Nullable_longitude', String(params.longitude));
      formData.append('Nullable_altitude', String(params.altitude));
      formData.append('Nullable_accuracy', '0');

      // ✅ 실제 값들
      formData.append('bounty_point', params.bounty_point);
      formData.append('remain_in_minute', params.remain_in_minute);
      formData.append('latitude', String(params.latitude));
      formData.append('longitude', String(params.longitude));
      if (params.altitude) {
        formData.append('altitude', String(params.altitude));
      }

      // ✅ Request 파라미터 로그
      console.log('📋 [REQUEST] Parameters:');
      console.log('  - member_id:', params.currentMember.id);
      console.log('  - thread_type:', params.threadType);
      console.log('  - description:', params.description);
      console.log('  - bounty_point:', params.bounty_point);
      console.log('  - remain_in_minute:', params.remain_in_minute);
      console.log('  - latitude:', params.latitude);
      console.log('  - longitude:', params.longitude);
      console.log('  - altitude:', params.altitude);
      console.log('  - region:', params.region);
      console.log('  ');
      console.log('  ✅ Nullable fields (모두 0 = false):');
      console.log('  - Nullable_bounty_point: 0');
      console.log('  - Nullable_remain_in_minute: 0');
      console.log('  - Nullable_is_hub_thread: 0');
      console.log('  - Nullable_is_child_thread_writable_by_others: 0');
      console.log('  - Nullable_is_private: 0');
      console.log('  - Nullable_is_map_replaces_image: 0');
      console.log('  - Nullable_latitude: 0');
      console.log('  - Nullable_longitude: 0');
      console.log('  - Nullable_altitude: 0');
      console.log('  - Nullable_accuracy: 0');

      // ✅ 이미지 여러개를 file_image_0, file_image_1 ... 형식으로 전송
      params.images.forEach((img, index) => {
        if (img.uri) {
          const file: any = {
            uri: img.uri,
            type: 'image/webp',
            name: (img.fileName || `photo_${index}`).replace(/\.\w+$/, '.webp'),
          };
          formData.append(`file_image_${index}`, file);

          console.log(`📷 [REQUEST] Image ${index}:`, {
            name: file.name,
            type: file.type,
            uri: file.uri.substring(0, 50) + '...',
            fileSize: img.fileSize,
            width: img.width,
            height: img.height,
          });
        }
      });

      console.log('🔄 [REQUEST] API 호출 중...');

      try {
        const startTime = Date.now();
        const res = await apiContents.post('/thread/createThread', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const duration = Date.now() - startTime;

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 [RESPONSE] Create Thread 성공');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⏱️  Duration:', duration, 'ms');
        console.log('📊 Status:', res.status);
        console.log('📦 Response Data:', JSON.stringify(res.data, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        return res.data;
      } catch (error: any) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('❌ [ERROR] Create Thread 실패');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔴 Error Message:', error.message);
        console.log('🔴 Error Response:', error.response?.data);
        console.log('🔴 Status Code:', error.response?.status);
        console.log('🔴 Full Error:', JSON.stringify(error, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        throw error;
      }
    },

    // 🚀 Optimistic Update: 즉시 캐시에 추가
    onMutate: async params => {
      console.log('🎭 [onMutate] Optimistic Update 시작');

      // 임시 ID 생성
      const tempId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      console.log('🆔 [onMutate] 임시 ID 생성:', tempId);

      // 임시 Thread 객체 생성
      const optimisticThread = createOptimisticThread(params, tempId);

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: THREAD_KEYS.list() });

      // 이전 데이터 스냅샷 (롤백용)
      const previousData = queryClient.getQueryData<
        InfiniteData<FetchFeedThreadsResult>
      >(THREAD_KEYS.list());

      console.log('💾 [onMutate] 이전 데이터 스냅샷 저장 완료');

      // 피드 리스트 캐시에 임시 Thread 추가 (맨 앞에)
      queryClient.setQueryData<InfiniteData<FetchFeedThreadsResult>>(
        THREAD_KEYS.list(),
        old => {
          if (!old) {
            console.log('📝 [onMutate] 캐시 없음 - 새로 생성');
            return {
              pages: [
                {
                  threads: [optimisticThread],
                  threadIds: [tempId],
                  nextCursorMark: null,
                },
              ],
              pageParams: [''],
            };
          }

          const newPages = [...old.pages];
          if (newPages.length > 0) {
            newPages[0] = {
              ...newPages[0],
              threads: [optimisticThread, ...newPages[0].threads],
              threadIds: [tempId, ...newPages[0].threadIds],
            };
          }

          console.log('✅ [onMutate] 첫 페이지 맨 앞에 임시 Thread 추가');

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      // 개별 Thread 캐시에도 추가
      queryClient.setQueryData(THREAD_KEYS.detail(tempId), optimisticThread);

      console.log(
        '✅ [onMutate] Optimistic Update 완료 - 피드에 즉시 표시됨!\n',
      );

      // 롤백용 데이터와 tempId 반환
      return { previousData, tempId };
    },

    // ✅ 성공: 임시 ID → 실제 ID 교체
    onSuccess: (data, params, context) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 [onSuccess] 서버 응답 성공 - ID 교체 시작');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (!context?.tempId) {
        console.warn('⚠️ [onSuccess] tempId 없음 - 교체 스킵');
        return;
      }

      const tempId = context.tempId;
      const realThreadId = data.threadId;

      console.log('🔄 [onSuccess] ID 교체:', {
        임시ID: tempId,
        실제ID: realThreadId,
      });

      // 1. 피드 리스트에서 임시ID → 실제ID 교체
      queryClient.setQueryData<InfiniteData<FetchFeedThreadsResult>>(
        THREAD_KEYS.list(),
        old => {
          if (!old) return old;

          const newPages = old.pages.map(page => ({
            ...page,
            threadIds: page.threadIds.map(id =>
              id === tempId ? realThreadId : id,
            ),
            threads: page.threads.map(thread =>
              thread.threadId === tempId
                ? { ...thread, threadId: realThreadId }
                : thread,
            ),
          }));

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      console.log('✅ [onSuccess] 피드 리스트 ID 교체 완료');

      // 2. 임시 Thread 캐시 삭제
      queryClient.removeQueries({ queryKey: THREAD_KEYS.detail(tempId) });
      console.log('🗑️ [onSuccess] 임시 Thread 캐시 삭제');

      // 3. 실제 Thread 캐시 추가 (서버 전체 데이터)
      queryClient.setQueryData(THREAD_KEYS.detail(realThreadId), data);
      console.log('💾 [onSuccess] 실제 Thread 캐시 저장');

      console.log('✅ [onSuccess] ID 교체 완료!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    },

    // ❌ 실패: 롤백
    onError: (error: any, params, context) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('❌ [onError] 실패 - 롤백 시작');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔴 Error:', error);

      if (context?.previousData) {
        queryClient.setQueryData(THREAD_KEYS.list(), context.previousData);
        console.log('↩️ [onError] 이전 상태로 롤백 완료');
      }

      if (context?.tempId) {
        queryClient.removeQueries({
          queryKey: THREAD_KEYS.detail(context.tempId),
        });
        console.log('🗑️ [onError] 임시 Thread 캐시 삭제');
      }

      console.log('✅ [onError] 롤백 완료');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    },

    // 🔄 완료: 쿼리 무효화 (선택사항)
    // onSettled: () => {
    //   console.log('🔄 [onSettled] 쿼리 무효화 시작');
    //   queryClient.invalidateQueries({ queryKey: THREAD_KEYS.list() });
    //   console.log('✅ [onSettled] 쿼리 무효화 완료\n');
    // },
  });

  const handleThreadSubmit = async (params: CreateThreadParams) => {
    console.log('🚀 [handleThreadSubmit] 호출됨');
    try {
      const result = await mutation.mutateAsync(params);
      console.log('🎉 [handleThreadSubmit] 성공:', result);
      return result;
    } catch (error) {
      console.log('💥 [handleThreadSubmit] 에러:', error);
      throw error;
    }
  };

  return {
    handleThreadSubmit,
    uploading: mutation.isPending,
  };
}
