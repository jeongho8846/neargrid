import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { MemberStats } from '../model/MemberStatsModel';

type Props = {
  stats?: MemberStats;
  isLoading?: boolean;
};

/**
 * ✅ MemberStatsRow
 * - 3행 구조:
 *   1️⃣ 받은 도네이션 / 준 도네이션
 *   2️⃣ 팔로워 / 팔로잉 / 챗봇
 *   3️⃣ 쓰레드 / 코멘트 / 멘션
 */
const MemberStatsRow: React.FC<Props> = ({ stats, isLoading }) => {
  const rows = [
    // 1️⃣ 도네이션
    [
      { key: 'STR_RECEIVED_DONATION', value: stats?.receivedPoint ?? 0 },
      { key: 'STR_GIVEN_DONATION', value: stats?.givenPoint ?? 0 },
    ],

    // 2️⃣ 소셜 관계
    [
      { key: 'STR_FOLLOWERS', value: stats?.followers ?? 0 },
      { key: 'STR_FOLLOWINGS', value: stats?.followings ?? 0 },
      { key: 'STR_CHATBOTS', value: stats?.chatBots ?? 0 },
    ],

    // 3️⃣ 활동량
    [
      { key: 'STR_THREADS', value: stats?.threads ?? 0 },
      { key: 'STR_COMMENTS', value: stats?.comments ?? 0 },
      { key: 'STR_MENTIONS', value: stats?.mentions ?? 0 },
    ],
  ];

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, colIndex) => (
            <View key={colIndex} style={styles.item}>
              <AppText variant="title" isLoading={isLoading}>
                {item.value}
              </AppText>
              <AppText variant="caption" i18nKey={item.key} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default MemberStatsRow;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SPACING.md,
    gap: SPACING.sm, // ✅ 행 간 간격
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  item: {
    alignItems: 'center',
  },
});
