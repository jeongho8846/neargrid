// src/features/map/screens/MapScreen.tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS } from '@/common/styles/colors';
import { calcMapSearchRadius } from '@/utils/mapUtils'; // ✅ 추가
import MapViewContainer, {
  MapViewContainerRef,
} from '@/features/map/components/MapViewContainer';
import MapThreadList from '@/features/map/components/MapThreadList';
import MapSearchBar from '@/features/map/components/MapSearchBar';
import FootprintButton from '@/features/map/components/FootprintButton';
import MapShowListButton from '@/features/map/components/MapShowListButton';
import MapSearchBottomSheet, {
  MapSearchBottomSheetRef,
} from '@/features/map/components/MapSearchBottomSheet';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import PermissionDialog from '@/common/components/PermissionDialog';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useMapThreads } from '@/features/map/hooks/useMapThreads';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapLocationPermission } from '@/features/map/hooks/useMapLocationPermission';
import { useMapRegion } from '@/features/map/hooks/useMapRegion';
import { SPACING } from '@/common/styles';

const MapScreen = () => {
  const mapRef = useRef<MapViewContainerRef>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const searchSheetRef = useRef<MapSearchBottomSheetRef>(null);
  const { isOpen } = useBottomSheetStore();

  const { region, handleRegionChange } = useMapRegion();
  const { searchParams, handleClearKeyword, setSearchParams } = useMapSearch();
  const {
    threads,
    loading,
    selectedIds,
    filteredThreads,
    handleMarkerPress,
    clearFilter,
    loadThreads,
  } = useMapThreads(searchParams);
  const { dialogVisible, handleConfirm, handleClose } =
    useMapLocationPermission();

  // ✅ 검색 BottomSheet 열기
  const handleSearchPress = () => {
    searchSheetRef.current?.open();
  };

  const handleSearch = (params: {
    keyword: string;
    threadTypes: string[];
    recentTimeMinute: number;
    remainTimeMinute: number;
    includePastRemainTime: boolean;
  }) => {
    setSearchParams({
      keyword: params.keyword,
      threadTypes: params.threadTypes,
      recentTimeMinute: params.recentTimeMinute,
      remainTimeMinute: params.remainTimeMinute,
      includePastRemainTime: params.includePastRemainTime,
    });

    if (region) {
      // ✅ region 기반으로 radius 동적 계산
      const radius = calcMapSearchRadius(region);
      console.log('🔍 [MapScreen] 검색 radius:', radius);

      loadThreads(
        {
          keyword: params.keyword,
          threadTypes: params.threadTypes,
          recentTimeMinute: params.recentTimeMinute,
          remainTimeMinute: params.remainTimeMinute,
          includePastRemainTime: params.includePastRemainTime,
        },
        region.latitude,
        region.longitude,
        radius, // ✅ 동적으로 계산된 거리 전달
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapViewContainer
        ref={mapRef}
        threads={threads}
        isLoading={loading}
        onMarkerPress={ids => handleMarkerPress(ids, sheetRef)}
        currentRegion={region}
        onRegionChange={handleRegionChange}
        searchParams={searchParams}
      />

      <View style={styles.header}>
        <View style={styles.header_left}>
          <FootprintButton />
        </View>
        <View style={styles.header_right}>
          <MapSearchBar
            keyword={searchParams.keyword}
            onPress={handleSearchPress}
          />
        </View>
      </View>

      <MapShowListButton onPress={() => sheetRef.current?.snapToIndex(1)} />

      <MapThreadList
        threads={filteredThreads}
        selectedCount={selectedIds.length}
        onClearFilter={clearFilter}
        onCurrentLocationPress={() => mapRef.current?.moveToCurrent()}
        sheetRef={sheetRef}
      />

      <MapSearchBottomSheet
        ref={searchSheetRef}
        onSearch={handleSearch}
        currentSearchParams={searchParams}
      />

      <PermissionDialog
        visible={dialogVisible}
        type="location"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />

      {isOpen && <BottomBlurGradient height={120} />}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    width: '100%',
    height: 40,
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.md,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
  },
  header_left: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  header_right: {
    flex: 8,
    justifyContent: 'flex-end',
  },
});
