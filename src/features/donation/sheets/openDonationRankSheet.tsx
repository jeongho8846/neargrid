import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import MemberDonationTabContainer from '../components/MemberDonationTabContainer';
import DonationRankRecipientList from '../lists/DonationRankRecipientList';
import DonationRankDonorList from '../lists/DonationRankDonorList';
import { useDonationTabStore } from '../state/donationTabStore';

/**
 * ✅ openDonationRankSheet
 * - initialTab: 'recipient' | 'donor'
 * - targetId: 프로필 대상 ID (optional)
 */
export const openDonationRankSheet = ({
  currentMemberId,
  targetId,
  initialTab = 'recipient',
}: {
  currentMemberId: string;
  targetId?: string;
  initialTab?: 'recipient' | 'donor';
}) => {
  const { open } = useBottomSheetStore.getState();

  console.log('🧾 [openDonationRankSheet] props:', {
    currentMemberId,
    targetId,
    initialTab,
  });

  open(
    <DonationRankSheetContent
      currentMemberId={currentMemberId}
      targetId={targetId}
      initialTab={initialTab}
    />,
    {
      snapPoints: ['1%', '90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
      onCloseCallback: () => {
        console.log('🧹 도네이션 랭킹 시트 닫힘 → Zustand 초기화');
        useDonationTabStore.getState().clearAll();
      },
    },
  );
};

const DonationRankSheetContent: React.FC<{
  currentMemberId: string;
  targetId?: string;
  initialTab: 'recipient' | 'donor';
}> = ({ currentMemberId, targetId, initialTab }) => {
  const [tab, setTab] = React.useState<'recipient' | 'donor'>(initialTab);

  return (
    <View style={styles.container}>
      <AppText style={styles.title} i18nKey="STR_DONATION_RANK_TITLE" />
      <MemberDonationTabContainer activeTab={tab} onChangeTab={setTab} />

      <View style={styles.content}>
        <View
          style={[
            styles.tabContent,
            { display: tab === 'recipient' ? 'flex' : 'none' },
          ]}
        >
          <DonationRankDonorList
            currentMemberId={currentMemberId}
            donorId={targetId}
          />
        </View>

        <View
          style={[
            styles.tabContent,
            { display: tab === 'donor' ? 'flex' : 'none' },
          ]}
        >
          <DonationRankRecipientList
            currentMemberId={currentMemberId}
            recipientId={targetId}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sheet_background,
  },
  title: {
    marginBottom: SPACING.sm,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
});
