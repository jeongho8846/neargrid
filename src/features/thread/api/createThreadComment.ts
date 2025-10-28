// src/features/thread/api/createThreadComment.ts
import { apiContents } from '@/services/apiService';
import { memberStorage } from '@/features/member/utils/memberStorage';
import { Platform } from 'react-native';
import { useLocationStore } from '@/features/location/state/locationStore';

export async function createThreadComment({
  threadId,
  description,
  parentCommentThreadId = null,
  file,
}: {
  threadId: string;
  description: string;
  parentCommentThreadId?: string | null;
  file?: { uri: string; type: string; name: string } | null;
}) {
  const member = await memberStorage.getMember();
  if (!member) throw new Error('로그인 정보 없음');

  // ✅ 위치 정보: store에서 직접 가져옴
  const { latitude, longitude, altitude } = useLocationStore.getState();
  if (latitude == null || longitude == null)
    throw new Error('위치 정보 없음 (GPS 초기화 필요)');

  const formData = new FormData();
  formData.append('current_member_id', member.id);
  formData.append('thread_id', threadId);
  formData.append('description', description);
  formData.append(
    'Nullable_parent_comment_thread_id',
    parentCommentThreadId ?? '',
  );
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  if (altitude != null) formData.append('altitude', String(altitude));

  if (file) {
    formData.append('file_image', {
      uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
      type: file.type,
      name: file.name,
    } as any);
  }

  console.log('📤 [createThreadComment] Request:', {
    memberId: member.id,
    threadId,
    description,
    latitude,
    longitude,
    altitude,
    file: file ? file.name : null,
  });

  try {
    const res = await apiContents.post(
      '/commentThread/createCommentThread',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    console.log('✅ [createThreadComment] Response:', res.status, res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ [createThreadComment] Error:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
}
