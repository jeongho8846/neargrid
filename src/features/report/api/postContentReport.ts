/**
 * ✅ postContentReport.ts
 * - 신고 API 호출 + 로그 출력 (request / response)
 */

import { apiContents } from '@/services/apiService';
import { ReportRequestDto } from '../model/ReportModel';

export const postContentReport = async (data: ReportRequestDto) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value ?? '');
  });

  // ✅ 요청 로그
  console.log('🚀 [postContentReport] 신고 요청 시작');
  console.log('📦 Request Payload:', {
    ...data,
    _formDataKeys: Object.keys(data),
  });

  try {
    const response = await apiContents.post('/report/contentReport', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // ✅ 응답 로그
    console.log('✅ [postContentReport] 신고 요청 성공');
    console.log('📥 Response Status:', response.status);
    console.log('📩 Response Data:', response.data);

    return response.data;
  } catch (error: any) {
    // ❌ 에러 로그
    console.error('❌ [postContentReport] 신고 요청 실패');
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📩 Response Data:', error.response.data);
    } else if (error.request) {
      console.error('📭 No Response (Request sent but no reply)');
    } else {
      console.error('⚙️ Error Message:', error.message);
    }

    throw error;
  }
};
