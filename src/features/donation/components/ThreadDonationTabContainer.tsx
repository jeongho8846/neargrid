// 📄 src/features/donation/components/ThreadDonationTabContainer.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import ThreadDonationList from '../lists/ThreadDonationList';
import ThreadDonationRankingList from '../lists/ThreadDonationRankingList';
import { TEST_COLORS } from '@/test/styles/colors';

type Props = {
  threadId: string;
  currentMemberId: string;
};

/**
 * ✅ ThreadDonationTabContainer
 * - 후원 내역 / 랭킹 탭 전환
 * - 닫히기 전까지 데이터 유지 (언마운트 X)
 * - AppText i18nKey 기반 번역
 */
const ThreadDonationTabContainer: React.FC<Props> = ({
  threadId,
  currentMemberId,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'ranking'>('history');

  // ✅ 마운트 시 전달된 프롭 로그
  useEffect(() => {
    console.log('🧾 [ThreadDonationTabContainer] props');
    console.log('  • threadId:', threadId);
    console.log('  • currentMemberId:', currentMemberId);
  }, [threadId, currentMemberId]);

  // ✅ 탭 변경 로그
  useEffect(() => {
    console.log('🔁 [ThreadDonationTabContainer] activeTab 변경:', activeTab);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* ✅ 탭 헤더 */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'history' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <AppText
            i18nKey="STR_DONATION_TAB_HISTORY"
            variant="button"
            color={
              activeTab === 'history'
                ? COLORS.text_primary
                : COLORS.text_secondary
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'ranking' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('ranking')}
          activeOpacity={0.8}
        >
          <AppText
            i18nKey="STR_DONATION_TAB_RANKING"
            variant="button"
            color={
              activeTab === 'ranking'
                ? COLORS.text_primary
                : COLORS.text_secondary
            }
          />
        </TouchableOpacity>
      </View>

      {/* ✅ 탭 컨텐츠 (두 컴포넌트 항상 마운트) */}
      <View style={styles.content}>
        <View
          style={[
            styles.tabContent,
            { display: activeTab === 'history' ? 'flex' : 'none' },
          ]}
        >
          <ThreadDonationList
            threadId={threadId}
            currentMemberId={currentMemberId}
          />
        </View>

        <View
          style={[
            styles.tabContent,
            { display: activeTab === 'ranking' ? 'flex' : 'none' },
          ]}
        >
          <ThreadDonationRankingList
            threadId={threadId}
            currentMemberId={currentMemberId}
          />
        </View>
      </View>
    </View>
  );
};

export default ThreadDonationTabContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.sm,
    width: '50%',
    alignContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: TEST_COLORS.button_active,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
});
