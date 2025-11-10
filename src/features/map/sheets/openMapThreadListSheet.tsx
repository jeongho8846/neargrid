import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { useMapThreadStore } from '../state/mapThreadStore';
import ThreadItemCard from '@/features/thread/components/thread_item_card';

/**
 * ✅ 지도용 스레드 리스트 시트
 * - Zustand store에서 threads 구독 → 자동 갱신
 * - ThreadItemCard로 렌더링 (3열 그리드)
 */
export const openMapThreadListSheet = () => {
  const { open } = useBottomSheetStore.getState();

  const SheetContent = () => {
    const { threads } = useMapThreadStore();

    return (
      <View style={styles.container}>
        <AppText i18nKey="STR_MAP_THREAD_LIST_TITLE" variant="title" />
        <AppText i18nKey="STR_MAP_THREAD_LIST_DESC" variant="caption" />

        <AppFlashList
          data={threads}
          numColumns={2} // ✅ 3열 자동 분할
          keyExtractor={item => item.threadId}
          renderItem={({ item }) => (
            <ThreadItemCard
              thread={item}
              onPress={() => {
                console.log('🧭 thread clicked:', item.threadId);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row} // ✅ 3열 간격 조정
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <AppText
              i18nKey="STR_MAP_THREAD_LIST_EMPTY"
              variant="caption"
              style={styles.empty}
            />
          }
        />
      </View>
    );
  };

  open(<SheetContent />, {
    snapPoints: ['35%', '90%'],
    initialIndex: 1,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
    autoCloseOnIndexZero: false,
    enablePanDownToClose: false,
    backdropPressToClose: false,
    useBackdrop: false,
  });
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.sheet_background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    flex: 1,
  },
  listContent: {},
  row: {
    justifyContent: 'space-between',
  },
  empty: {
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
