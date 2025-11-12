import { apiMember } from '@/services/apiService';
import type { PaymentHistoryResponse } from '../model/PaymentHistoryModel';

/**
 * 🔹 결제내역 리스트 조회 API
 * GET /payment/getPaymentsByMember
 */
export const fetchPaymentHistory = async (
  currentMemberId: string,
  page: string = '0',
  size: string = '20',
): Promise<PaymentHistoryResponse> => {
  console.log('📡 [fetchPaymentHistory] 요청 시작');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 page:', page, 'size:', size);

  try {
    const response = await apiMember.get('/payment/getPaymentsByMember', {
      params: {
        current_member_id: currentMemberId,
        page,
        size,
      },
    });

    console.log('✅ [fetchPaymentHistory] 응답 수신');
    return response.data;
  } catch (error: any) {
    console.error('❌ [fetchPaymentHistory] 요청 실패:', error?.message);
    throw error;
  }
};
