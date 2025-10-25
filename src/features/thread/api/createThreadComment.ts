// src/features/thread/api/createThreadComment.ts
import { apiContents } from '@/services/apiService';
import { useLocationStore } from '@/features/location/state/locationStore';
import { memberStorage } from '@/features/member/utils/memberStorage';

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
  const member = await memberStorage.getMember(); // ✅ AsyncStorage에서 멤버 읽기
  if (!member) throw new Error('로그인 정보 없음');

  const { latitude, longitude, altitude } = useLocationStore.getState(); // ✅ 스토어에서 좌표 읽기
  if (latitude == null || longitude == null) throw new Error('위치 정보 없음');

  const formData = new FormData();
  formData.append('current_member_id', member.id); // ✅ 멤버 ID 자동 삽입
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
      uri: file.uri,
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
