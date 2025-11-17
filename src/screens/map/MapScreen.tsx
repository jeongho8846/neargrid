import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import AppText from '@/common/components/AppText';
import MapViewContainer, {
  MapViewContainerRef,
} from '@/features/map/components/MapViewContainer';
import ThreadItemCard from '@/features/thread/components/thread_item_card';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useFetchMapThreads } from '@/features/map/hooks/useFetchMapThreads';
import { useMapThreadStore } from '@/features/map/state/mapThreadStore';
import AppMapZoomControls from '@/common/components/AppMapView/controls/AppMapZoomControls';
import AppMapCurrentLocationButton from '@/common/components/AppMapView/controls/AppMapCurrentLocationButton';
import AppIcon from '@/common/components/AppIcon';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_PRESETS } from '@/test/styles/presets';
import { TEST_SPACING } from '@/test/styles/spacing';
import { usePermission } from '@/common/hooks/usePermission';
import PermissionDialog from '@/common/components/PermissionDialog';

const MapScreen = () => {
  const { member } = useCurrentMember();
  const { threads, setThreads, clearThreads } = useMapThreadStore();
  const { fetchThreads, loading } = useFetchMapThreads();
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapViewContainerRef>(null);
  const navigation = useNavigation();
  const { setRef, isOpen } = useBottomSheetStore();
  const snapPoints = useMemo(() => [1, '50%', '90%'], []);

  // ✅ 위치 권한
  const locationPermission = usePermission('location');
  const [locationGranted, setLocationGranted] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
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
  });

  // ✅ 최초 진입 시 위치 권한 요청
  useEffect(() => {
    const requestLocation = async () => {
      const status = await locationPermission.check();

      if (status === 'granted') {
        setLocationGranted(true);
        return;
      }

      // 권한 다이얼로그 표시
      const result = await locationPermission.request();
      setLocationGranted(result.granted);
    };

    requestLocation();
  }, []);

  const { isOpen: sheetOpen, close, open } = useBottomSheetStore();
  const handleSheetChange = useCallback((index: number) => {
    if (index === 0) {
      useBottomSheetStore.setState({ isOpen: false });
    } else {
      useBottomSheetStore.setState({ isOpen: true });
    }
  }, []);

  const loadThreads = useCallback(
    async (params = searchParams, lat?: number, lon?: number) => {
      if (!member?.id) return;
      try {
        const res = await fetchThreads({
          latitude: lat ?? 37.5665,
          longitude: lon ?? 126.978,
          distance: 3000,
          memberId: member.id,
          keyword: params.keyword,
          threadTypes: params.threadTypes,
          recentTimeMinute: params.recentTimeMinute,
          remainTimeMinute: params.remainTimeMinute,
          includePastRemainTime: params.includePastRemainTime,
        });
        setThreads(res);
      } catch (err) {
        console.error('❌ fetchThreads 실패:', err);
      }
    },
    [member?.id, fetchThreads, setThreads, searchParams],
  );

  const handleMarkerPress = (ids: string[]) => {
    setSelectedIds(ids);
    sheetRef.current?.snapToIndex(1);
  };

  const handleClearKeyword = () => {
    const reset = { ...searchParams, keyword: '' };
    setSearchParams(reset);
    loadThreads(reset);
  };

  const clearFilter = () => setSelectedIds([]);

  const filteredThreads =
    selectedIds.length > 0
      ? threads.filter(t => selectedIds.includes(t.threadId))
      : threads;

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
        <AppText variant="title">{`${filteredThreads.length}`}</AppText>
      </View>
      <View style={styles.headerRight}>
        {selectedIds.length > 0 && (
          <TouchableOpacity onPress={clearFilter} activeOpacity={0.8}>
            <AppText i18nKey="STR_CLEAR_FILTER" variant="button" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapViewContainer
        ref={mapRef}
        memberId={member?.id}
        threads={threads}
        isLoading={loading}
        onMarkerPress={handleMarkerPress}
        onMoveToLocation={(lat, lon) => {
          loadThreads(searchParams, lat, lon);
        }}
      />

      <TouchableOpacity
        style={styles.showListButton}
        activeOpacity={0.8}
        onPress={() => sheetRef.current?.snapToIndex(1)}
      >
        <AppText i18nKey="STR_MAP_BUTTON_SHOWLIST" variant="button" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <AppIcon name="footsteps" type="ion" size={24} variant="primary" />
      </TouchableOpacity>

      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.searchArea}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('MapSearch')}
        >
          <AppIcon name="search" type="ion" size={18} variant="secondary" />
          <AppText variant="body" style={styles.searchText}>
            {searchParams.keyword || '검색어를 입력하세요'}
          </AppText>
        </TouchableOpacity>

        {searchParams.keyword.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearKeyword}
            activeOpacity={0.7}
          >
            <AppIcon
              name="close-circle"
              type="ion"
              size={20}
              variant="secondary"
            />
          </TouchableOpacity>
        )}
      </View>

      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        onChange={handleSheetChange}
        handleComponent={() => (
          <View style={styles.handleContainer}>
            <View style={styles.handleIndicator} />
            <View style={styles.controlsRow}>
              <AppMapZoomControls
                onZoomIn={() => mapRef.current?.zoomIn()}
                onZoomOut={() => mapRef.current?.zoomOut()}
              />
              <AppMapCurrentLocationButton
                onPress={() => mapRef.current?.moveToCurrent()}
              />
            </View>
          </View>
        )}
      >
        <BottomSheetFlatList
          data={filteredThreads}
          keyExtractor={item => item.threadId.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{
            paddingHorizontal: SPACING.sm,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheet>

      {/* ✅ 위치 권한 다이얼로그 */}
      <PermissionDialog
        visible={locationPermission.dialogVisible}
        type="location"
        onConfirm={locationPermission.handleConfirm}
        onClose={locationPermission.handleClose}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  leftButton: {
    position: 'absolute',
    top: 10,
    left: SPACING.xs,
    zIndex: 20,
    backgroundColor: COLORS.sheet_backdrop,
    padding: 8,
    borderRadius: 10,
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 50,
    right: SPACING.sm,
    height: 42,
    backgroundColor: COLORS.sheet_backdrop,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchText: {
    marginLeft: 8,
    flexShrink: 1,
  },
  clearButton: {
    padding: 4,
    marginLeft: 6,
  },
  showListButton: {
    ...TEST_PRESETS.buttonBase,
    backgroundColor: TEST_COLORS.primary,
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    borderRadius: 24,
  },
  sheetBackground: {
    backgroundColor: COLORS.background,
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
    bottom: 150,
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
