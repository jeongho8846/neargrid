import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createThread } from '../api/createThread';
import AppToast from '@/common/components/AppToast';

type Params = {
  currentMember: any;
  description: string;
  remain_in_minute: string;
  images: any[];
  navigation?: any;
  threadType: string;
  bounty_point: string;
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  region?: any;
};

export const useCreateThread = () => {
  const [uploading, setUploading] = useState(false);

  const handleThreadSubmit = useCallback(
    async ({
      currentMember,
      description,
      remain_in_minute,
      images,
      navigation,
      threadType,
      bounty_point,
      latitude,
      longitude,
      altitude,
      region,
    }: Params) => {
      if (uploading) return;
      setUploading(true);

      console.group('🧩 [useCreateThread] 전달받은 값');
      console.log('👤 currentMember:', currentMember);
      console.log('📝 description:', description);
      console.log('🕒 remain_in_minute:', remain_in_minute);
      console.log('🎨 images:', images);
      console.log('🧭 region:', region);
      console.log('🏷️ threadType:', threadType);
      console.log('💰 bounty_point:', bounty_point);
      console.log('📍 latitude:', latitude);
      console.log('📍 longitude:', longitude);
      console.log('📏 altitude:', altitude);
      console.groupEnd();

      if (description.length === 0 && images.length === 0) {
        Alert.alert('오류', '텍스트나 이미지를 입력하세요.');
        setUploading(false);
        return;
      }

      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('🚫 토큰이 없습니다.');
          setUploading(false);
          return;
        }

        const formData = new FormData();

        // ✅ 필드 추가 + 즉시 로깅 (entries 사용 안 함)
        const appendField = (key: string, value: any) => {
          formData.append(key, value);
          console.log(`🔹 ${key}:`, value);
        };

        appendField('current_member_id', currentMember?.id ?? '');
        appendField('member_id', currentMember?.id ?? '');
        appendField('description', description);
        appendField('thread_type', threadType);
        appendField('Nullable_bounty_point', bounty_point || '0');
        appendField('Nullable_remain_in_minute', remain_in_minute || '0');
        appendField('Nullable_is_hub_thread', 'false');
        appendField('Nullable_is_child_thread_writable_by_others', 'true');
        appendField('Nullable_is_private', 'false');
        appendField('Nullable_is_map_replaces_image', 'false');
        appendField(
          'Nullable_latitude',
          (region?.latitude ?? latitude ?? 0).toString(),
        );
        appendField(
          'Nullable_longitude',
          (region?.longitude ?? longitude ?? 0).toString(),
        );
        appendField('Nullable_altitude', (altitude ?? 0).toString());
        appendField('Nullable_accuracy', '1');

        // ✅ 이미지 파일 추가
        images.forEach((image: any, index: number) => {
          if (!image?.uri) return;
          console.log(`🖼️ 파일[${index}]`, image.fileName);
          formData.append(`file_image_${index}`, {
            name: image.fileName,
            type: image.type,
            uri: image.uri,
          } as any);
        });

        console.log('🔑 token 존재 여부:', !!token);
        console.log('📤 FormData 준비 완료 (entries 미사용 RN-safe)');

        // ✅ API 호출
        await createThread(formData, token);

        // AppToast.show({ type: 'success', text1: '업로드 완료!' });

        if (navigation && typeof navigation.goBack === 'function') {
          navigation.goBack();
        }
      } catch (err) {
        console.error('❌ 업로드 오류:', err);
        // AppToast.show({ type: 'error', text1: '업로드 실패' });
      } finally {
        setUploading(false);
      }
    },
    [uploading],
  );

  return { handleThreadSubmit, uploading };
};
