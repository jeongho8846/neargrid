export type CreateDonationForMemberParams = {
  current_member_id: string;
  target_member_id: string;
  point: number;
  message?: string;
};

export async function createDonationForMember(
  _params: CreateDonationForMemberParams,
) {
  // TODO: 서버 스펙 연결 (/donation/createDonationToMember)
  // 아래는 자리표시자
  return { ok: true };
}
