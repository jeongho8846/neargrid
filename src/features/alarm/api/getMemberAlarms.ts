import { apiContents } from '@/services/apiService';
import type { GetMemberAlarmsResp } from '../model/AlarmModel';

/**
 * ✅ 회원 알람 목록 조회
 * - 요청/응답 콘솔 로그 추가
 */
export async function getMemberAlarms(params: {
  current_member_id: string;
  paging_state?: string;
}) {
  console.group('📡 [API] getMemberAlarms');
  console.log('➡️ Request Params:', params);

  try {
    const { data } = await apiContents.get<GetMemberAlarmsResp>(
      '/alarm/getMemberAlarms',
      { params },
    );
    console.log('✅ Response:', data);
    console.groupEnd();
    return data;
  } catch (error: any) {
    console.error('❌ Error (getMemberAlarms):', error.response?.data || error);
    console.groupEnd();
    throw error;
  }
}

/**
 * ✅ 모든 알람 읽음 처리
 * - 요청/응답 콘솔 로그 추가
 */
export async function viewAllAlarms(current_member_id: string) {
  console.group('📡 [API] viewAllAlarms');
  console.log('➡️ Request MemberID:', current_member_id);

  const formData = new FormData();
  formData.append('current_member_id', current_member_id);

  try {
    const res = await apiContents.post('/alarm/viewAllAlarms', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Response:', res.data);
    console.groupEnd();
    return res.data;
  } catch (error: any) {
    console.error('❌ Error (viewAllAlarms):', error.response?.data || error);
    console.groupEnd();
    throw error;
  }
}

/**
 * ✅ 단일 핀 조회
 * - 요청/응답 콘솔 로그 추가
 */
export async function readPinSingle(params: {
  pin_id: string;
  current_member_id: string;
}) {
  console.group('📡 [API] readPinSingle');
  console.log('➡️ Request Params:', params);

  try {
    const { data } = await apiContents.get('/pin/readPinSingle', { params });
    console.log('✅ Response:', data);
    console.groupEnd();
    return data;
  } catch (error: any) {
    console.error('❌ Error (readPinSingle):', error.response?.data || error);
    console.groupEnd();
    throw error;
  }
}
