// src/features/map/screens/MapScreen.tsx
import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS } from '@/common/styles/colors';
import { calcMapSearchRadius } from '@/utils/mapUtils';
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
import AppMapCurrentLocationButton from '@/common/components/AppMapView/controls/AppMapCurrentLocationButton';
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
  const hasMovedToCurrentRef = useRef(false);
  const { isOpen } = useBottomSheetStore();

  const { region, handleRegionChange } = useMapRegion();
  const { searchParams, setSearchParams } = useMapSearch();
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

  // ✅ 화면에 포커스될 때 현재 위치로 이동 (한 번만)
  useFocusEffect(
    useCallback(() => {
      if (!hasMovedToCurrentRef.current) {
        // InteractionManager 또는 setTimeout으로 렌더링 완료 후 실행
        const timer = setTimeout(() => {
          console.log('🗺️ [MapScreen] 현재 위치로 이동 시도');
          mapRef.current?.moveToCurrent();
          hasMovedToCurrentRef.current = true;
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, []),
  );

  const handleSearchPress = () => {
    searchSheetRef.current?.open();
  };

  const handleClearKeywordAndSearch = () => {
    const defaultParams = {
      keyword: '',
      threadTypes: [
        'GENERAL_THREAD',
        'MOMENT_THREAD',
        'PLAN_TO_VISIT_THREAD',
        'ROUTE_THREAD',
      ],
      recentTimeMinute: 60 * 24 * 365 * 999,
      remainTimeMinute: 60 * 24 * 365,
      includePastRemainTime: false,
    };

    setSearchParams(defaultParams);

    if (region) {
      const radius = calcMapSearchRadius(region);
      loadThreads(defaultParams, region.latitude, region.longitude, radius);
    }
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
      const radius = calcMapSearchRadius(region);
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
        radius,
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

      <View style={styles.header} pointerEvents="box-none">
        <View style={styles.header_left}>
          <FootprintButton />
        </View>
        <View style={styles.header_right}>
          <MapSearchBar
            keyword={searchParams.keyword}
            onPress={handleSearchPress}
            onClearKeyword={handleClearKeywordAndSearch}
          />
        </View>
      </View>

      <MapShowListButton onPress={() => sheetRef.current?.snapToIndex(1)} />

      {!isOpen && (
        <View style={styles.currentLocationButtonContainer}>
          <AppMapCurrentLocationButton
            onPress={() => mapRef.current?.moveToCurrent()}
          />
        </View>
      )}

      <MapThreadList
        threads={filteredThreads}
        selectedCount={selectedIds.length}
        onClearFilter={clearFilter}
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
  currentLocationButtonContainer: {
    position: 'absolute',
    right: -10,
    bottom: 100,

  },
});
