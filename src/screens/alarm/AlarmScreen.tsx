// 📄 src/screens/alarm/AlarmScreen.tsx
import React, { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFetchMemberAlarms } from '@/features/alarm/hooks/useFetchMemberAlarms';
import AlarmList from '@/features/alarm/lists/AlarmList';
import {
  checkPermission,
  requestNotificationPermission,
} from '@/services/device/permissionService';
import { initFCM } from '@/services/notification/fcmService';
import { COLORS } from '@/common/styles/colors';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { SPACING } from '@/common/styles';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { useHeaderScroll } from '@/common/hooks/useHeaderScroll'; // ✅ 교체
import AppText from '@/common/components/AppText';
import { useViewAllAlarms } from '@/features/alarm/hooks/useViewAllAlarms';
import type { AlarmModel } from '@/features/alarm/model/AlarmModel';
import { createEmptyThread } from '@/features/thread/model/ThreadModel';

export default function AlarmScreen() {
  const { member } = useCurrentMember();
  const { data } = useFetchMemberAlarms(member?.id);
  const { markAllAsRead, loading } = useViewAllAlarms();
  const navigation = useNavigation<any>();

  // ✅ Reanimated 기반 헤더 제어
  const { headerStyle, scrollHandler } = useHeaderScroll(56);

  const handleAllRead = async () => {
    if (!member?.id || loading) return;
    await markAllAsRead(member.id);
  };

  const handleAlarmPress = useCallback(
    (alarm: AlarmModel) => {
      if (!alarm) return;

      switch (alarm.alarmType) {
        case 'NEW_FOLLOWER':
          if (alarm.sendMemberId) {
            navigation.navigate('Profile', { memberId: alarm.sendMemberId });
          }
          break;
        case 'THREAD_REPLY':
        case 'COMMENT_THREAD':
        case 'CHILD_COMMENT_THREAD':
        case 'THREAD_REACTION':
        case 'COMMENT_THREAD_REACTION': {
          const threadId =
            alarm.parentParentTargetId ??
            alarm.parentTargetId ??
            alarm.targetId ??
            null;

          if (!threadId) {
            break;
          }

          const thread = {
            ...createEmptyThread(threadId),
            description:
              alarm.targetDescription ?? alarm.parentTargetDescription ?? '',
            contentImageUrls: alarm.targetImageUrl
              ? [alarm.targetImageUrl]
              : [],
            memberId: alarm.sendMemberId ?? '',
            memberNickName: alarm.sendMemberNickName ?? '',
            memberProfileImageUrl: alarm.sendMemberProfileImageUrl ?? '',
          };

          navigation.navigate('DetailThread', { thread });
          break;
        }
        default:
          break;
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const ensureNotificationPermission = async () => {
        try {
          const currentStatus = await checkPermission('notification');

          if (!isActive) {
            return;
          }

          if (currentStatus === 'granted') {
            return;
          }

          const granted = await requestNotificationPermission();

          if (isActive && granted) {
            await initFCM(member?.id);
          }
        } catch (error) {
          console.log(
            '[AlarmScreen] Failed to ensure notification permission',
            error,
          );
        }
      };

      void ensureNotificationPermission();

      return () => {
        isActive = false;
      };
    }, [member?.id]),
  );

  return (
    <View style={styles.root}>
      {/* ✅ Toss-style 헤더 (Reanimated 연결) */}
      <AppCollapsibleHeader
        titleKey="STR_ALARM"
        animatedStyle={headerStyle} // ✅ 변경
        right={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleAllRead}>
              <AppText variant="link" i18nKey="STR_ALL_READ" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* ✅ 알람 리스트 */}
      <View style={styles.listContainer}>
        <AlarmList
          data={data ?? []}
          onItemPress={handleAlarmPress}
          onScroll={scrollHandler} // ✅ 연결
          scrollEventThrottle={16} // ✅ 추가
        />
      </View>
    </View>
  );
}

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingTop: SPACING.md,
  },
  listContainer: {
    flex: 1,
    paddingTop: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 'auto',
    paddingRight: SPACING.sm,
    padding: 1,
  },
});
