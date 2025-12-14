import { apiContents } from '@/services/apiService';
import { memberStorage } from '@/features/member/utils/memberStorage';

type AddThreadEditMembersParams = {
  threadId: string;
  memberIds: string[] | string;
  currentMemberId?: string;
};

/**
 * 편집자 추가 API
 * - member_ids는 콤마 문자열 (예: "1,2,3")
 */
export const addThreadEditMembers = async ({
  threadId,
  memberIds,
  currentMemberId,
}: AddThreadEditMembersParams) => {
  console.log('[addThreadEditMembers] called', {
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
    '/thread/addThreadEditMembers',
    null,
    {
      params: {
        current_member_id: resolvedCurrentMemberId,
        thread_id: threadId,
        member_ids: memberIdsString,
      },
    },
  );

  console.log('[addThreadEditMembers] response', response.data);

  return response.data;
};
