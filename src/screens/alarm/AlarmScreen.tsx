import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFetchMemberAlarms } from '@/features/alarm/hooks/useFetchMemberAlarms';
import AlarmList from '@/features/alarm/lists/AlarmList';
import { COLORS } from '@/common/styles/colors';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { SPACING } from '@/common/styles';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppText from '@/common/components/AppText';
import { useViewAllAlarms } from '@/features/alarm/hooks/useViewAllAlarms';

export default function AlarmScreen() {
  const { member } = useCurrentMember();
  const { data } = useFetchMemberAlarms(member?.id);
  const { headerOffset } = useCollapsibleHeader(0);
  const { markAllAsRead, loading } = useViewAllAlarms();

  const handleAllRead = async () => {
    if (!member?.id || loading) return;
    await markAllAsRead(member.id);
  };

  return (
    <View style={styles.root}>
      <AppCollapsibleHeader
        titleKey="STR_ALARM"
        headerOffset={headerOffset}
        isAtTop={true}
        right={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleAllRead}>
              <AppText variant="link" i18nKey="STR_ALL_READ" />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.listContainer}>
        <AlarmList data={data ?? []} />
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
    alignItems: 'flex-end', // ✅ 오른쪽 정렬
    justifyContent: 'center',
    marginLeft: 'auto', // ✅ 남는 공간 밀어내기
    paddingRight: SPACING.sm, // 살짝 여유
    padding: 1,
  },
});
