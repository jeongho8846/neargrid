import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';

export default function TestFlashListScreen() {
  const data = Array.from({ length: 1000 }).map((_, i) => `아이템 ${i + 1}`);

  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <AppText variant="body">{item}</AppText>
          </View>
        )}
        estimatedItemSize={60 as any} // ✅ 타입 경고 무시
        keyExtractor={(item, index) => `${item}-${index}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border_light,
  },
});
