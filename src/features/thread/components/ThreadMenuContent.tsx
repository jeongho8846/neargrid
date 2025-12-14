// 📄 src/features/thread/components/ThreadMenuContent.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { Thread } from '../model/ThreadModel';
import { useThreadMenuActions } from '../hooks/useThreadMenuActions';

const ThreadMenuContent: React.FC<{ thread: Thread; hubThreadId?: string }> = ({
  thread,
  hubThreadId,
}) => {
  console.log('쓰레드옵션넘언오는값', thread);
  const actions = useThreadMenuActions(thread, { hubThreadId });

  // ✅ available 상태에 따라 숨기기/숨기기 취소 전환
  const hideLabelKey = thread.available
    ? 'STR_THREAD_MENU_HIDE'
    : 'STR_THREAD_MENU_UNHIDE';
  const isChildThread = thread.depth > 0;

  return (
    <View style={styles.container}>
      {/* 1️⃣ 그룹 - 복사 */}
      <View style={styles.groupBox}>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={actions.copyLink}
        >
          <View style={styles.left}>
            <AppIcon type="ion" name="link-outline" size={20} />
            <AppText i18nKey="STR_THREAD_MENU_COPY_LINK" variant="body" />
          </View>
        </TouchableOpacity>
      </View>

      {/* 2️⃣ 그룹 - 프로필 이동, 후원하기 */}
      <View style={styles.groupBox}>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={actions.navigateProfile}
        >
          <View style={styles.left}>
            <AppIcon type="ion" name="person-outline" size={20} />
            <AppText i18nKey="STR_THREAD_MENU_PROFILE" variant="body" />
          </View>
          {/* ✅ 이동형 */}
          <AppIcon
            type="ion"
            name="chevron-forward"
            size={18}
            variant="secondary"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={actions.openDonationSheet}
        >
          <View style={styles.left}>
            <AppIcon type="ion" name="gift-outline" size={20} />
            <AppText i18nKey="STR_THREAD_MENU_DONATION" variant="body" />
          </View>
          {/* ✅ 시트 오픈형 */}
          <AppIcon
            type="ion"
            name="chevron-forward"
            size={18}
            variant="secondary"
          />
        </TouchableOpacity>
      </View>

      {/* 2.5️⃣ 그룹 - 허브 연결 해제 (자식일 때만) */}
      {isChildThread && (
        <View style={styles.groupBox}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={actions.detachFromHubThread}
          >
            <View style={styles.left}>
              <AppIcon type="ion" name="remove-circle-outline" size={20} />
              <AppText
                i18nKey="STR_THREAD_MENU_DETACH_FROM_HUB"
                variant="body"
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* 3️⃣ 그룹 - 숨기기/숨기기 취소, 신고 */}
      <View style={styles.groupBox}>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={actions.toggleHideThread}
        >
          <View style={styles.left}>
            <AppIcon
              type="ion"
              name={thread.available ? 'eye-off-outline' : 'eye-outline'}
              size={20}
            />
            <AppText i18nKey={hideLabelKey} variant="body" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={actions.report}
        >
          <View style={styles.left}>
            <AppIcon type="ion" name="alert-circle-outline" size={20} />
            <AppText i18nKey="STR_THREAD_MENU_REPORT" variant="danger" />
          </View>
          {/* ✅ 이동형 */}
          <AppIcon
            type="ion"
            name="chevron-forward"
            size={18}
            variant="secondary"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThreadMenuContent;

const styles = StyleSheet.create({
  container: { padding: SPACING.xs },
  groupBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
});
