import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { Thread } from '../model/ThreadModel';
import { THREAD_KEYS } from '../keys/threadKeys';
import AppToast from '@/common/components/AppToast/AppToastManager';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { openDonateSheet } from '@/features/donation/sheets/openDonateSheet';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useDetachThreadFromHubThread } from './useDetachThreadFromHubThread';

// ✅ 신고 시트 import
import { openReportSheet } from '@/features/report/sheets/openReportSheet';

type ThreadMenuActionOptions = {
  hubThreadId?: string;
};

export const useThreadMenuActions = (
  thread: Thread,
  options: ThreadMenuActionOptions = {},
) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { close } = useBottomSheetStore();
  const { member } = useCurrentMember();
  const { detach } = useDetachThreadFromHubThread();
  const { hubThreadId } = options;

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
      currentPoint: member.point ?? 0,
    });
  };

  /**
   * ✅ 숨기기 / 숨기기 취소
   */
  const toggleHideThread = () => {
    queryClient.setQueryData(THREAD_KEYS.list(), (old: any) => {
      if (!old?.pages) return old;
      return {
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
    });

    queryClient.setQueryData(
      THREAD_KEYS.detail(thread.threadId),
      (old: Thread | undefined) =>
        old ? { ...old, available: !old.available } : old,
    );

    close();
  };

  /**
   * ✅ 신고 BottomSheet 열기
   */
  const report = async () => {
    try {
      await openReportSheet({
        contentId: thread.threadId,
        content_type: 'THREAD',
        parent_content_id: '',
      });
    } catch (error) {
      console.error('🚨 신고 시트 열기 실패:', error);
    }
  };

  /**
   * ✅ 허브 스레드에서 분리 (자식일 때만)
   */
  const detachFromHubThread = async () => {
    if (!member?.id || !hubThreadId) {
      console.warn(
        '[useThreadMenuActions] detachFromHubThread 누락된 값',
        member?.id,
        hubThreadId,
      );
      AppToast.show('필수 정보가 없습니다');
      return;
    }

    const success = await detach({
      currentMemberId: member.id,
      hubThreadId,
      threadId: thread.threadId,
    });

    if (success) {
      close();
    }
  };

  return {
    copyLink,
    navigateProfile,
    openDonationSheet,
    toggleHideThread,
    report,
    detachFromHubThread,
  };
};
