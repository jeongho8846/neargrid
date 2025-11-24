import { useMutation } from '@tanstack/react-query';
import { apiContents } from '@/services/apiService';
import type { Asset } from 'react-native-image-picker';

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

export function useCreateThread() {
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
    onSuccess: data => {
      console.log('✅ [useMutation] onSuccess 호출됨');
      console.log('✅ Success Data:', data);
    },
    onError: (error: any) => {
      console.log('❌ [useMutation] onError 호출됨');
      console.log('❌ Error:', error);
    },
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
