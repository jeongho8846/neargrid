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
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import PermissionDialog from '@/common/components/PermissionDialog';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useMapThreads } from '@/features/map/hooks/useMapThreads';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapLocationPermission } from '@/features/map/hooks/useMapLocationPermission';

const MapScreen = () => {
  const mapRef = useRef<MapViewContainerRef>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const { isOpen } = useBottomSheetStore();

  // ✅ 검색 관련
  const { searchParams, handleSearchPress, handleClearKeyword } =
    useMapSearch();

  // ✅ 데이터 관련
  const {
    threads,
    loading,
    selectedIds,
    filteredThreads,
    handleMarkerPress,
    clearFilter,
  } = useMapThreads(searchParams);

  // ✅ 위치 권한 관련
  const { dialogVisible, handleConfirm, handleClose } =
    useMapLocationPermission();

  return (
    <View style={styles.container}>
      {/* 지도 */}
      <MapViewContainer
        ref={mapRef}
        threads={threads}
        isLoading={loading}
        onMarkerPress={handleMarkerPress}
        searchParams={searchParams}
      />

      {/* 검색바 */}
      <MapSearchBar
        keyword={searchParams.keyword}
        onClearKeyword={handleClearKeyword}
      />

      {/* 플로팅 버튼들 */}
      <MapFloatingButtons sheetRef={sheetRef} />

      {/* 쓰레드 리스트 (BottomSheet) */}
      <MapThreadList
        threads={filteredThreads}
        selectedCount={selectedIds.length}
        onClearFilter={clearFilter}
        onCurrentLocationPress={() => mapRef.current?.moveToCurrent()}
      />

      {/* 권한 다이얼로그 */}
      <PermissionDialog
        visible={dialogVisible}
        type="location"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />

      {/* 하단 블러 */}
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
});
