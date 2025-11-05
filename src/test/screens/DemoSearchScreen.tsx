import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from '@/common/components/AppText';
import DemoFilterButton from '@/test/components/DemoFilterButton';
import DemoNavigator from '@/test/components/DemoNavigator';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

const DemoSearchScreen = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const buttonGroups = [
    ['카페', '공원', '식당', '서점'],
    ['아침', '점심', '저녁', '야간'],
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <AppText variant="title" style={styles.headerTitle}>
          버튼 선택 테스트
        </AppText>

        {buttonGroups.map((group, i) => (
          <View key={i} style={styles.groupBox}>
            <View style={styles.buttonRow}>
              {group.map((label, idx) => (
                <DemoFilterButton
                  key={idx}
                  label={label}
                  selected={selected === label}
                  onPress={() =>
                    setSelected(prev => (prev === label ? null : label))
                  }
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <DemoNavigator />
    </View>
  );
};

export default DemoSearchScreen;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEST_COLORS.background,
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  headerTitle: {
    marginBottom: TEST_SPACING.md,
  },
  groupBox: {
    backgroundColor: TEST_COLORS.surface,
    borderRadius: TEST_RADIUS.md,
    padding: TEST_SPACING.md,
    marginBottom: TEST_SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TEST_SPACING.sm,
  },
});
