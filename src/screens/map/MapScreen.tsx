import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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

const MapScreen = () => {
  const { member } = useCurrentMember();
  const { threads, setThreads, clearThreads } = useMapThreadStore();
  const { fetchThreads, loading } = useFetchMapThreads();
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapViewContainerRef>(null);
  const navigation = useNavigation();
  const snapPoints = useMemo(() => [55, '50%', '90%'], []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /** ✅ 데이터 로드 */
  useEffect(() => {
    const load = async () => {
      if (!member?.id) return;
      const res = await fetchThreads({
        latitude: 37.5665,
        longitude: 126.978,
        distance: 90000000,
        memberId: member.id,
      });
      setThreads(res);
    };
    load();
    return () => clearThreads();
  }, [member?.id]);

  /** ✅ 화면 진입 시 자동 시트 오픈 */
  useFocusEffect(
    useCallback(() => {
      sheetRef.current?.snapToIndex(1);
      return () => sheetRef.current?.close();
    }, []),
  );

  /** ✅ 마커 클릭 시 필터 */
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
        <AppText variant="title">
          {selectedIds.length > 0
            ? `${filteredThreads.length}개`
            : `전체 ${filteredThreads.length}개`}
        </AppText>
      </View>

      {selectedIds.length > 0 && (
        <TouchableOpacity onPress={clearFilter} activeOpacity={0.8}>
          <AppText i18nKey="STR_CLEAR_FILTER" variant="button" />
        </TouchableOpacity>
      )}
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
      />

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
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
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
});
