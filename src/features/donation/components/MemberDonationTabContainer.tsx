import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type TabKey = 'recipient' | 'donor';

type Props = {
  activeTab: TabKey;
  onChangeTab: (key: TabKey) => void;
};

/**
 * ✅ MemberDonationTabContainer
 * - 받은 도네이션 / 준 도네이션 탭
 * - ThreadDonationTabContainer 스타일 통일 버전
 */
const MemberDonationTabContainer: React.FC<Props> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'donor' && styles.activeTabButton,
        ]}
        onPress={() => onChangeTab('donor')}
        activeOpacity={0.8}
      >
        <AppText
          i18nKey="STR_RECEIVED_DONATION"
          variant="button"
          color={
            activeTab === 'donor' ? COLORS.text_primary : COLORS.text_secondary
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'recipient' && styles.activeTabButton,
        ]}
        onPress={() => onChangeTab('recipient')}
        activeOpacity={0.8}
      >
        <AppText
          i18nKey="STR_GIVEN_DONATION"
          variant="button"
          color={
            activeTab === 'recipient'
              ? COLORS.text_primary
              : COLORS.text_secondary
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default MemberDonationTabContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.sheet_background,
  },
  tabButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.sm,
    width: '50%',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: COLORS.button_active,
  },
});
