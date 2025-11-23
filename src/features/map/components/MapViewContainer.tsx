// src/features/map/components/MapViewContainer.tsx
import React, {
  useRef,
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import { Region } from 'react-native-maps';
import AppMapView from '@/common/components/AppMapView';
import MapThreadMarker from './MapThreadMarker';
import { COLORS } from '@/common/styles/colors';
import AppText from '@/common/components/AppText';
import { useFetchMapThreads } from '../hooks/useFetchMapThreads';
import { useLocationStore } from '@/features/location/state/locationStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import {
  clusterMarkersByScreen,
  calcMapSearchRadius,
  getMapCenter,
} from '@/utils/mapUtils';
import AppMapSearchHereButton from '@/common/components/AppMapView/controls/AppMapSearchHereButton';
import AppMapCurrentMarker from '@/common/components/AppMapView/markers/AppMapCurrentMarker';

export type MapViewContainerRef = {
  zoomIn: () => void;
  zoomOut: () => void;
  moveToCurrent: () => void;
};

type Props = {
  memberId?: string;
  threads: any[];
  isLoading: boolean;
  onMarkerPress?: (ids: string[]) => void;
  currentRegion: Region | null;
  onRegionChange: (region: Region) => void;
  searchParams?: {
    keyword: string;
    preserveRegion?: Region | null;
  };
};

const MapViewContainer = forwardRef<MapViewContainerRef, Props>(
  (
    {
      memberId,
      threads,
      isLoading,
      onMarkerPress,
      currentRegion,
      onRegionChange,
      searchParams,
    },
    ref,
  ) => {
    const mapRef = useRef<any>(null);
    const zoomRef = useRef(0.05);
    const { latitude, longitude } = useLocationStore();
    const { member } = useCurrentMember();
    const { fetchThreads } = useFetchMapThreads();
    const [region, setRegion] = useState<Region | null>(null);
    const [clusters, setClusters] = useState<any[][]>([]);
    const hasInitializedRef = useRef(false);

    // ✅ 최초 1회만 내 위치로 이동 (initialRegion이 기본값일 때만)
    useEffect(() => {
      if (hasInitializedRef.current) return;
      if (!latitude || !longitude || !mapRef.current) return;

      // preserveRegion이나 currentRegion이 있으면 내 위치로 이동 안 함
      if (searchParams?.preserveRegion || currentRegion) {
        hasInitializedRef.current = true;
        return;
      }

      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: zoomRef.current,
          longitudeDelta: zoomRef.current,
        },
        600,
      );

      hasInitializedRef.current = true;
    }, [latitude, longitude, currentRegion, searchParams?.preserveRegion]);

    // ✅ 검색 후 돌아왔을 때 preserveRegion으로 복원
    useEffect(() => {
      if (searchParams?.preserveRegion && mapRef.current) {
        const { latitude, longitude, latitudeDelta, longitudeDelta } =
          searchParams.preserveRegion;
        console.log(
          '🗺️ preserveRegion으로 지도 복원:',
          searchParams.preserveRegion,
        );
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          },
          600,
        );
      }
    }, [searchParams?.preserveRegion]);

    // ✅ threads가 바뀌면 클러스터링 재실행
    useEffect(() => {
      if (!mapRef.current || !region || threads.length === 0) return;
      console.log('🧩 검색 완료 후 클러스터링 재실행:', threads.length);
      InteractionManager.runAfterInteractions(async () => {
        const grouped = await clusterMarkersByScreen(mapRef, threads, 35);
        setClusters(grouped);
      });
    }, [threads]);

    /** ✅ 지도 핸들러를 외부로 노출 */
    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        if (!region) return;
        zoomRef.current = Math.max(zoomRef.current * 0.5, 0.002);
        mapRef.current?.animateToRegion(
          {
            ...region,
            latitudeDelta: zoomRef.current,
            longitudeDelta: zoomRef.current,
          },
          300,
        );
      },
      zoomOut: () => {
        if (!region) return;
        zoomRef.current = Math.min(zoomRef.current * 2, 1);
        mapRef.current?.animateToRegion(
          {
            ...region,
            latitudeDelta: zoomRef.current,
            longitudeDelta: zoomRef.current,
          },
          300,
        );
      },
      moveToCurrent: () => {
        if (!latitude || !longitude || !mapRef.current) return;
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: zoomRef.current,
            longitudeDelta: zoomRef.current,
          },
          600,
        );
      },
    }));

    const handleRegionChangeComplete = (newRegion: Region) => {
      setRegion(newRegion);
      onRegionChange(newRegion); // ✅ 부모(MapScreen)에게 지도 중심 좌표 업데이트

      InteractionManager.runAfterInteractions(async () => {
        if (mapRef.current && threads.length > 0) {
          const grouped = await clusterMarkersByScreen(mapRef, threads, 35);
          setClusters(grouped);
        }
      });
    };

    const handleSearchHere = async () => {
      if (!region) return;
      const { latitude: centerLat, longitude: centerLon } =
        getMapCenter(region);
      const radius = calcMapSearchRadius(region);
      await fetchThreads({
        latitude: centerLat,
        longitude: centerLon,
        distance: radius,
        memberId: memberId ?? member?.id ?? '',
      });
    };

    // ✅ initialRegion 결정 우선순위:
    // 1. preserveRegion (검색 후 복귀)
    // 2. currentRegion (지도의 마지막 중심 위치)
    // 3. 기본값 (서울)
    const initialRegion = searchParams?.preserveRegion ||
      currentRegion || {
        latitude: 37.5665,
        longitude: 126.978,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

    return (
      <View style={styles.container}>
        <AppMapView
          ref={mapRef}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {latitude && longitude && (
            <AppMapCurrentMarker latitude={latitude} longitude={longitude} />
          )}

          {/* ✅ 클러스터 마커 기존 로직 그대로 */}
          {clusters.map((group, i) => {
            if (group.length === 1) {
              const t = group[0];
              return (
                <MapThreadMarker
                  key={t.threadId}
                  latitude={t.latitude}
                  longitude={t.longitude}
                  imageUrl={t.markerImageUrl}
                  profileImageUrl={t.memberProfileImageUrl}
                  onPress={() => onMarkerPress?.([t.threadId])}
                />
              );
            }

            const avgLat =
              group.reduce((sum, g) => sum + g.latitude, 0) / group.length;
            const avgLon =
              group.reduce((sum, g) => sum + g.longitude, 0) / group.length;
            const representative = group[0];

            return (
              <MapThreadMarker
                key={`cluster-${i}`}
                latitude={avgLat}
                longitude={avgLon}
                imageUrl={representative.markerImageUrl}
                profileImageUrl={representative.memberProfileImageUrl}
                reactionCount={group.length}
                onPress={() => onMarkerPress?.(group.map(t => t.threadId))}
              />
            );
          })}
        </AppMapView>

        {/* ✅ 기존 "이 위치에서 검색" 버튼 유지 */}
        <AppMapSearchHereButton
          onPress={handleSearchHere}
          isLoading={isLoading}
        />

        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator color={COLORS.button_active} size="large" />
            <AppText i18nKey="STR_MAP_LOADING" variant="caption" />
          </View>
        )}
      </View>
    );
  },
);

export default MapViewContainer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
