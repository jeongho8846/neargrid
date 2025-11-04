import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { MemberStats } from '../model/MemberStatsModel';
import { openDonationRankSheet } from '@/features/donation/sheets/openDonationRankSheet';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

type Props = {
  stats?: MemberStats;
  isLoading?: boolean;
  targetId?: string;
  receivedPoint?: number;
  givenPoint?: number;
};

const MemberStatsRow: React.FC<Props> = ({
  stats,
  isLoading,
  targetId,
  receivedPoint = 0,
  givenPoint = 0,
}) => {
  const { member } = useCurrentMember();

  /** ✅ 도네이션 랭킹 시트 열기 */
  const handleOpenRankSheet = (tab: 'recipient' | 'donor') => {
    if (!member?.id) return;
    openDonationRankSheet({
      currentMemberId: member.id,
      targetId,
      initialTab: tab,
    });
  };

  const rows = [
    [
      {
        key: 'STR_RECEIVED_DONATION',
        value: receivedPoint ?? 0,
        onPress: () => handleOpenRankSheet('donor'),
      },
      {
        key: 'STR_GIVEN_DONATION',
        value: givenPoint ?? 0,
        onPress: () => handleOpenRankSheet('recipient'),
      },
    ],
    [
      { key: 'STR_FOLLOWERS', value: stats?.followers ?? 0 },
      { key: 'STR_FOLLOWINGS', value: stats?.followings ?? 0 },
      { key: 'STR_CHATBOTS', value: stats?.chatBots ?? 0 },
    ],
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
          {row.map((item, colIndex) => {
            const isDonationRow = rowIndex === 0;

            const Content = (
              <>
                <AppText variant="title" isLoading={isLoading}>
                  {item.value}
                </AppText>
                <AppText variant="caption" i18nKey={item.key} />
              </>
            );

            return isDonationRow ? (
              <TouchableOpacity
                key={colIndex}
                style={styles.item}
                activeOpacity={0.8}
                onPress={item.onPress}
              >
                {Content}
              </TouchableOpacity>
            ) : (
              <View key={colIndex} style={styles.item}>
                {Content}
              </View>
            );
          })}
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
    gap: SPACING.sm,
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
