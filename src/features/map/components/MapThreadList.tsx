// src/features/map/components/MapThreadList.tsx

import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import AppText from '@/common/components/AppText';
import ThreadItemCard from '@/features/thread/components/thread_item_card';
import AppMapCurrentLocationButton from '@/common/components/AppMapView/controls/AppMapCurrentLocationButton';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

type Props = {
  threads: any[];
  selectedCount: number;
  onClearFilter: () => void;
  onCurrentLocationPress: () => void;
  sheetRef?: React.RefObject<BottomSheet>;
};

const MapThreadList: React.FC<Props> = ({
  threads,
  selectedCount,
  onClearFilter,
  onCurrentLocationPress,
  sheetRef: externalSheetRef,
}) => {
  const internalSheetRef = useRef<BottomSheet>(null);
  const sheetRef = externalSheetRef || internalSheetRef;
  const navigation = useNavigation();
  const snapPoints = useMemo(() => [1, '50%', '90%'], []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSheetChange = useCallback((index: number) => {
    setCurrentIndex(index);
    if (index === 0) {
      useBottomSheetStore.setState({ isOpen: false });
    } else {
      useBottomSheetStore.setState({ isOpen: true });
    }
  }, []);

  const renderItem = ({ item }: any) => (
    <ThreadItemCard
      thread={item}
      onPress={() => navigation.navigate('DetailThread', { thread: item })}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <AppText i18nKey="STR_MAP_THREAD_LIST" variant="title" />
        <AppText variant="title">{`${threads.length}`}</AppText>
      </View>
      <View style={styles.headerRight}>
        {selectedCount > 0 && (
          <TouchableOpacity onPress={onClearFilter} activeOpacity={0.8}>
            <AppText i18nKey="STR_CLEAR_FILTER" variant="button" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBackground}
      onChange={handleSheetChange}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handleIndicator} />
          {/* ✅ index가 1 이상일 때만 버튼 표시 */}
          {currentIndex >= 1 && (
            <View style={styles.controlsRow}>
              <AppMapCurrentLocationButton onPress={onCurrentLocationPress} />
            </View>
          )}
        </View>
      )}
    >
      <BottomSheetFlatList
        data={threads}
        keyExtractor={item => item.threadId.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingHorizontal: SPACING.sm,
          paddingBottom: 110,
        }}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
};

export default MapThreadList;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.sheet_background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  handleContainer: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.sheet_handle,
    marginBottom: 10,
    alignSelf: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    right: -11,
    bottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
