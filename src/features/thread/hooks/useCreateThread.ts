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
      const formData = new FormData();

      formData.append('member_id', params.currentMember.id);
      formData.append('description', params.description);
      formData.append('thread_type', params.threadType);
      formData.append('bounty_point', params.bounty_point);
      formData.append('remain_in_minute', params.remain_in_minute);
      formData.append('latitude', String(params.latitude));
      formData.append('longitude', String(params.longitude));
      if (params.altitude) formData.append('altitude', String(params.altitude));

      // ✅ 이미지 여러개를 file_image_0, file_image_1 ... 형식으로 전송
      params.images.forEach((img, index) => {
        if (img.uri) {
          const file: any = {
            uri: img.uri,
            type: 'image/webp', // ✅ 강제 webp
            name: (img.fileName || `photo_${index}`).replace(/\.\w+$/, '.webp'),
          };
          formData.append(`file_image_${index}`, file);
        }
      });

      // ✅ API 호출
      const res = await apiContents.post('/threads/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });

  const handleThreadSubmit = async (params: CreateThreadParams) => {
    await mutation.mutateAsync(params);
  };

  return {
    handleThreadSubmit,
    uploading: mutation.isPending,
  };
}
