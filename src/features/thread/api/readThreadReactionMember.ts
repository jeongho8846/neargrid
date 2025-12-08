import { apiContents } from '@/services/apiService';
import { memberStorage } from '@/features/member/utils/memberStorage';

type ReadThreadReactionMemberParams = {
  threadId: string;
  currentUserId?: string | null;
};

export const readThreadReactionMember = async ({
  threadId,
  currentUserId,
}: ReadThreadReactionMemberParams) => {
  const member = await memberStorage.getMember();
  if (!member) throw new Error('memberStorage에 member 정보 없음');

  const response = await apiContents.get('/thread/readThreadReactionMember', {
    params: {
      thread_id: threadId,
      Blankable_current_member_id: currentUserId,
      current_member_id: member.id,
    },
  });

  // 🔥 여기서 데이터 구조 확인용 로그
  console.log('📌 readThreadReactionMember response:', response.data);

  return response.data;
};
