// 📄 src/features/thread/hooks/useThreadMenuActions.ts
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { Thread } from '../model/ThreadModel';
import { THREAD_KEYS } from '../keys/threadKeys';
import AppToast from '@/common/components/AppToast/AppToastManager';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { openDonateSheet } from '@/features/donation/sheets/openDonateSheet'; // ✅ 후원 시트 변경
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

export const useThreadMenuActions = (thread: Thread) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { close } = useBottomSheetStore();
  const { member } = useCurrentMember(); // ✅ 현재 로그인한 멤버 가져오기

  /**
   * ✅ 링크 복사
   */
  const copyLink = () => {
    Clipboard.setString(`https://neargrid.ai/thread/${thread.threadId}`);
    if (Platform.OS === 'ios') {
      AppToast.show('COPY');
    }
    close();
  };

  /**
   * ✅ 프로필 이동
   */
  const navigateProfile = () => {
    navigation.navigate(
      'Profile' as never,
      { memberId: thread.memberId } as never,
    );
    console.log('프로필이동', thread.memberId);
    close();
  };

  /**
   * ✅ 후원하기 시트 오픈 (DonateContainer)
   */
  const openDonationSheet = () => {
    if (!member?.id) {
      AppToast.show('로그인이 필요합니다');
      return;
    }

    openDonateSheet({
      currentMemberId: member.id,
      threadId: thread.threadId,
      currentPoint: member.point ?? 0, // optional
    });
    // close();
  };

  /**
   * ✅ 숨기기 / 숨기기 취소
   */
  /**
   * ✅ 숨기기 / 숨기기 취소
   */
  const toggleHideThread = () => {
    // ✅ 1. 리스트 캐시 (InfiniteQuery 구조)
    queryClient.setQueryData(THREAD_KEYS.list(), (old: any) => {
      if (!old?.pages) return old;

      const newData = {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          threads: page.threads
            ? page.threads.map((t: Thread) =>
                t.threadId === thread.threadId
                  ? { ...t, available: !t.available }
                  : t,
              )
            : page.threads,
        })),
      };
      return newData;
    });

    // ✅ 2. 단일 Thread 캐시(detail)
    queryClient.setQueryData(
      THREAD_KEYS.detail(thread.threadId),
      (old: Thread | undefined) => {
        if (!old) return old;
        return { ...old, available: !old.available };
      },
    );

    // ✅ 3. 사용자 피드백

    close();
  };

  /**
   * ✅ 신고 (임시)
   */
  const report = () => {
    AppToast.show('신고 기능은 준비 중입니다');
    close();
  };

  return {
    copyLink,
    navigateProfile,
    openDonationSheet,
    toggleHideThread,
    report,
  };
};
