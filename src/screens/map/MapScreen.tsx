// src/features/map/screens/MapScreen.tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS } from '@/common/styles/colors';
import MapViewContainer, {
  MapViewContainerRef,
} from '@/features/map/components/MapViewContainer';
import MapThreadList from '@/features/map/components/MapThreadList';
import MapSearchBar from '@/features/map/components/MapSearchBar';
import MapFloatingButtons from '@/features/map/components/MapFloatingButtons';
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

  // ✅ 지도 region 관리
  const { region, handleRegionChange } = useMapRegion();

  // ✅ 검색 관련
  const { searchParams, handleClearKeyword, setSearchParams } = useMapSearch();

  // ✅ 데이터 관련
  const {
    threads,
    loading,
    selectedIds,
    filteredThreads,
    handleMarkerPress,
    clearFilter,
    loadThreads,
  } = useMapThreads(searchParams);

  // ✅ 위치 권한 관련
  const { dialogVisible, handleConfirm, handleClose } =
    useMapLocationPermission();

  // ✅ 검색 BottomSheet 열기
  const handleSearchPress = () => {
    searchSheetRef.current?.open();
  };

  // ✅ 검색 실행
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

    // 현재 지도 중심에서 검색
    if (region) {
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
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapViewContainer
        ref={mapRef}
        threads={threads}
        isLoading={loading}
        onMarkerPress={handleMarkerPress}
        currentRegion={region}
        onRegionChange={handleRegionChange}
        searchParams={searchParams}
      />
      <View style={styles.haeder}>
        <View style={styles.haeder_left}>
          <MapFloatingButtons sheetRef={sheetRef} />
        </View>
        <View style={styles.haeder_right}>
          <MapSearchBar
            keyword={searchParams.keyword}
            onPress={handleSearchPress}
            onClearKeyword={handleClearKeyword}
          />
        </View>
      </View>

      <MapThreadList
        threads={filteredThreads}
        selectedCount={selectedIds.length}
        onClearFilter={clearFilter}
        onCurrentLocationPress={() => mapRef.current?.moveToCurrent()}
      />

      <MapSearchBottomSheet ref={searchSheetRef} onSearch={handleSearch} />

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
  haeder: {
    width: '100%',
    height: 40,

    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.md,
    position: 'absolute',
    top: 0,

    flexDirection: 'row',
  },
  haeder_left: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  haeder_right: { flex: 8, justifyContent: 'flex-end' },
});
