// src/features/donation/api/createDonationForThread.ts
import { apiContents } from '@/services/apiService';

export type CreateDonationThreadParams = {
  current_member_id: string;
  thread_id: string;
  point: number;
  message?: string; // ← 사용자가 안 적어도 빈 문자열로 보냄
};

export type CreateDonationThreadResponse = {
  ok: boolean;
  donationId?: string;
  updatedFields?: Partial<{
    donationTotal: number;
    donationCount: number;
    donorCount: number;
  }>;
  message?: string;
};

export async function createDonationForThread(
  params: CreateDonationThreadParams,
): Promise<CreateDonationThreadResponse> {
  const { current_member_id, thread_id, point, message } = params;

  if (!current_member_id || !thread_id)
    throw new Error('current_member_id와 thread_id는 필수입니다.');
  if (!Number.isFinite(point) || point <= 0)
    throw new Error('point는 0보다 큰 숫자여야 합니다.');

  const form = new FormData();
  form.append('current_member_id', String(current_member_id));
  form.append('thread_id', String(thread_id));
  form.append('point', String(point));
  form.append('message', message ?? ''); // ★ 항상 존재하게

  // 디버깅 로그 (필요 없으면 지워도 됨)
  console.log('📤 createDonationForThread multipart fields:', {
    current_member_id: String(current_member_id),
    thread_id: String(thread_id),
    point: String(point),
    message: message ?? '',
  });

  try {
    const res = await apiContents.post('/donation/createDonationThread', form, {
      headers: { 'Content-Type': 'multipart/form-data' }, // boundary는 axios가 자동 설정
    });

    console.log('📥 createDonationForThread 응답:', res?.data);

    return {
      ok: true,
      donationId: res?.data?.donationId,
      updatedFields: res?.data?.updatedFields,
      message: res?.data?.message,
    };
  } catch (err: any) {
    console.error(
      '❌ createDonationForThread 오류:',
      err?.response?.data || err,
    );
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      '후원 처리 중 오류가 발생했습니다.';
    throw new Error(msg);
  }
}
