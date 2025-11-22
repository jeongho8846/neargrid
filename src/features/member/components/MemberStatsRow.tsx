import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { MemberStats } from '../model/MemberStatsModel';
import { openDonationRankSheet } from '@/features/donation/sheets/openDonationRankSheet';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { openFollowerListSheet } from '@/features/member/sheets/openFollowerListSheet';
import { openFollowingListSheet } from '@/features/member/sheets/openFollowingListSheet';

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

  /** ✅ 팔로워 / 팔로잉 시트 열기 */
  /** ✅ 팔로워 / 팔로잉 시트 열기 */
  const handleOpenFollowSheet = (type: 'followers' | 'followings') => {
    if (!targetId || !member?.id) return;
    if (type === 'followers')
      openFollowerListSheet({ targetId, currentMemberId: member.id });
    else openFollowingListSheet({ targetId, currentMemberId: member.id });
  };

  /** ✅ 3줄 구성 */
  const rows = [
    // ① 도네이션
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
    // ② 팔로우 관련
    [
      {
        key: 'STR_FOLLOWERS',
        value: stats?.followers ?? 0,
        onPress: () => handleOpenFollowSheet('followers'),
      },
      {
        key: 'STR_FOLLOWINGS',
        value: stats?.followings ?? 0,
        onPress: () => handleOpenFollowSheet('followings'),
      },
      { key: 'STR_CHATBOTS', value: stats?.chatBots ?? 0 },
    ],
    // ③ 활동 관련
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
            const hasPress = typeof item.onPress === 'function';

            const Content = (
              <>
                <AppText variant="title" isLoading={isLoading}>
                  {item.value}
                </AppText>
                <AppText variant="caption" i18nKey={item.key} />
              </>
            );

            return hasPress ? (
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
    gap: SPACING.md,
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
