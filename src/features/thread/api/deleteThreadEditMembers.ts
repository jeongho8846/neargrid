import { apiContents } from '@/services/apiService';
import { memberStorage } from '@/features/member/utils/memberStorage';

type DeleteThreadEditMembersParams = {
  threadId: string;
  memberIds: string[] | string;
  currentMemberId?: string;
};

/**
 * 편집자 목록에서 선택된 멤버들을 제거하는 API
 * - member_ids는 콤마로 이어붙인 문자열 (예: "1,2,3")
 * - 모두 제거하면 빈 문자열 전송
 */
export const deleteThreadEditMembers = async ({
  threadId,
  memberIds,
  currentMemberId,
}: DeleteThreadEditMembersParams) => {
  console.log('[deleteThreadEditMembers] called', {
    threadId,
    memberIds,
    currentMemberId,
  });

  const storedMember = await memberStorage.getMember();
  const resolvedCurrentMemberId = currentMemberId ?? storedMember?.id;

  if (!resolvedCurrentMemberId) {
    throw new Error('currentMemberId가 없습니다.');
  }

  const memberIdsString = Array.isArray(memberIds)
    ? memberIds.filter(Boolean).join(',')
    : memberIds ?? '';

  const response = await apiContents.post(
    '/thread/deleteThreadEditMembers',
    null,
    {
      params: {
        current_member_id: resolvedCurrentMemberId,
        thread_id: threadId,
        member_ids: memberIdsString,
      },
    },
  );

  console.log('[deleteThreadEditMembers] response', response.data);

  return response.data;
};
