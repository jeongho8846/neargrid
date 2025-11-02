// 📄 src/screens/footprint/FootPrintScreen.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import AppText from '@/common/components/AppText';
import FootPrintMapViewContainer from '@/features/footprint/components/FootPrintMapViewContainer';
import ThreadItemCard from '@/features/thread/components/thread_item_card';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useMapThreadStore } from '@/features/map/state/mapThreadStore';
import AppMapZoomControls from '@/common/components/AppMapView/controls/AppMapZoomControls';
import AppMapCurrentLocationButton from '@/common/components/AppMapView/controls/AppMapCurrentLocationButton';
import AppIcon from '@/common/components/AppIcon';
import { useFetchFootPrintContents } from '@/features/footprint/hooks/useFetchFootPrintContents';
import AppDateRangePicker from '@/common/components/AppDateRangePicker';

const FootPrintScreen = () => {
  const { member } = useCurrentMember();
  const { threads, setThreads, clearThreads } = useMapThreadStore();
  const { fetchContents, loading } = useFetchFootPrintContents();

  const navigation = useNavigation();
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => [60, '50%', '90%'], []); // ✅ MapScreen 동일

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2025-01-01T00:00:00'),
    endDate: new Date(),
  });

  /** ✅ 발자국 데이터 로드 */
  const loadFootPrints = useCallback(async () => {
    if (!member?.id) return;

    const toIso = (d: Date) => d.toISOString().slice(0, 19);

    try {
      const res = await fetchContents({
        memberId: member.id,
        startDateTime: toIso(dateRange.startDate),
        endDateTime: toIso(dateRange.endDate),
      });

      const converted = res
        .filter((item: any) => !!item.gpsLocationResponseDto)
        .map((item: any, index: number) => {
          const markerImage =
            item.markerImageUrl ??
            item.contentImageUrls?.[0] ??
            item.memberProfileImageUrl ??
            null;

          return {
            threadId: item.threadId || String(index),
            latitude: item.gpsLocationResponseDto.latitude,
            longitude: item.gpsLocationResponseDto.longitude,
            description: item.description ?? '',
            memberNickName: item.memberNickName,
            memberProfileImageUrl: item.memberProfileImageUrl,
            contentImageUrls: item.contentImageUrls ?? [],
            markerImageUrl: markerImage,
            reactionCount: item.reactionCount ?? 0,
            commentCount: item.commentThreadCount ?? 0,
            createDatetime: item.createDatetime,
          };
        });

      setThreads(converted);
    } catch (err: any) {
      console.error('❌ FootPrint 데이터 로드 실패:', err.message);
      console.error('📛 서버 응답:', err.response?.data || '(서버 응답 없음)');
    }
  }, [member?.id, dateRange, fetchContents, setThreads]);

  useEffect(() => {
    loadFootPrints();
    return () => clearThreads();
  }, [member?.id]);

  /** ✅ 마커 클릭 시 */
  const handleMarkerPress = (ids: string[]) => {
    setSelectedIds(ids);
    sheetRef.current?.snapToIndex(1);
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
      {/* ✅ 지도 */}
      <FootPrintMapViewContainer
        ref={mapRef}
        memberId={member?.id}
        threads={threads}
        isLoading={loading}
        onMarkerPress={handleMarkerPress}
      />

      {/* ✅ 왼쪽 상단 뒤로가기 버튼 */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => navigation.navigate('Map', { from: 'FootPrint' })}
        activeOpacity={0.8}
      >
        <AppIcon name="arrow-back" type="ion" size={24} variant="primary" />
      </TouchableOpacity>

      {/* ✅ 상단 검색창 위치에 날짜선택기 배치 */}
      <View style={styles.searchBar}>
        <View style={styles.searchArea}>
          <AppDateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
            showApplyButton
            onApply={loadFootPrints}
          />
        </View>
      </View>

      {/* ✅ 바텀시트 (MapScreen과 동일) */}
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

export default FootPrintScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  /** ✅ 왼쪽 상단 버튼 */
  leftButton: {
    position: 'absolute',
    top: 10,
    left: SPACING.xs,
    zIndex: 20,
    backgroundColor: COLORS.sheet_backdrop,
    padding: 8,
    borderRadius: 10,
  },

  /** ✅ MapScreen의 searchBar를 그대로 가져와서 date picker용으로 재활용 */
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

  /** ✅ 이하 MapScreen과 완전 동일 */
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
