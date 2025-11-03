// 📄 src/screens/map/MapScreen.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
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

const MapScreen = () => {
  const { member } = useCurrentMember();
  const { threads, setThreads, clearThreads } = useMapThreadStore();
  const { fetchThreads, loading } = useFetchMapThreads();
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapViewContainerRef>(null);
  const navigation = useNavigation();
  const snapPoints = useMemo(() => [60, '50%', '90%'], []);

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

  /** ✅ 스레드 데이터 로드 (직접 호출 전용) */
  const loadThreads = useCallback(
    async (params = searchParams, lat?: number, lon?: number) => {
      if (!member?.id) return;
      try {
        const res = await fetchThreads({
          latitude: lat ?? 37.5665, // ✅ 동적 좌표
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

  /** ✅ 마커 클릭 */
  const handleMarkerPress = (ids: string[]) => {
    setSelectedIds(ids);
    sheetRef.current?.snapToIndex(1);
  };

  /** ✅ 검색 초기화 */
  const handleClearKeyword = () => {
    const reset = { ...searchParams, keyword: '' };
    setSearchParams(reset);
    loadThreads(reset); // ✅ 이 경우만 검색 수행
  };

  /** ✅ 필터 해제 */
  const clearFilter = () => setSelectedIds([]);

  /** ✅ 지도에서 선택된 스레드 필터링 */
  const filteredThreads =
    selectedIds.length > 0
      ? threads.filter(t => selectedIds.includes(t.threadId))
      : threads;

  /** ✅ 리스트 아이템 렌더 */
  const renderItem = ({ item }: any) => (
    <ThreadItemCard
      thread={item}
      onPress={() => navigation.navigate('DetailThread', { thread: item })}
    />
  );

  /** ✅ 리스트 헤더 */
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
      {/* ✅ 지도 */}
      <MapViewContainer
        ref={mapRef}
        memberId={member?.id}
        threads={threads}
        isLoading={loading}
        onMarkerPress={handleMarkerPress}
        onMoveToLocation={(lat, lon) => {
          console.log('📍 내 위치 도착 → 현재 지도 중심으로 검색 실행');
          loadThreads(searchParams, lat, lon); // ✅ 이 경우만 검색 수행
        }}
      />

      {/* ✅ 왼쪽 상단 FootPrint 이동 버튼 */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => {
          // navigation.navigate('FootPrint' as never);
        }}
        activeOpacity={0.8}
      >
        <AppIcon name="footsteps" type="ion" size={24} variant="primary" />
      </TouchableOpacity>

      {/* ✅ 상단 검색창 */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.searchArea}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('MapSearch')}
        >
          <AppIcon name="search" type="ion" size={18} variant="secondary" />
          <AppText variant="body" style={styles.searchText}>
            {searchParams.keyword
              ? searchParams.keyword
              : '검색어를 입력하세요'}
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

      {/* ✅ 바텀시트 */}
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
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
