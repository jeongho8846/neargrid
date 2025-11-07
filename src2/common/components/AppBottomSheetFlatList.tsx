// 📄 src/common/components/AppBottomSheetFlatList.tsx
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../styles/tokens';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

type Item = { id: string; title: string };
const data: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: String(i),
  title: `아이템 ${i + 1}`,
}));

export default function AppBottomSheetFlatList() {
  const sheetRef = useRef<BottomSheet>(null);
  const listRef = useRef<BottomSheetFlatList<Item>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const snapPoints = useMemo(() => ['1', '40%', '81%'], []);
  const insets = useSafeAreaInsets();
  const { setIsOpen } = useBottomSheetStore();

  const handleSheetChange = (index: number) => {
    setIsOpen(index >= 1);
  };

  const handleScroll = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 250);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={sheetRef}
        index={2}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChange}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        topInset={insets.top}
      >
        <BottomSheetFlatList
          ref={listRef}
          data={data}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ItemRow title={item.title} />}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 120,
          }}
        />
      </BottomSheet>

      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          activeOpacity={0.8}
          style={[styles.fab, { bottom: insets.bottom + SPACING.xl * 2 }]}
        >
          <AppIcon name="arrow-up" size={22} color={COLORS.surface_light} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function ItemRow({ title }: { title: string }) {
  return (
    <View style={styles.item}>
      <AppText tKey={title} variant="body" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    backgroundColor: COLORS.surface_light,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handle: { backgroundColor: COLORS.border_light },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border_light,
  },
  fab: {
    position: 'absolute',
    bottom: 0,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 9999,
    padding: 12,
  },
});
