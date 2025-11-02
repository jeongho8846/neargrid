import React, {
  useRef,
  useState,
  forwardRef,
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
};

const MapViewContainer = forwardRef<MapViewContainerRef, Props>(
  ({ memberId, threads, isLoading, onMarkerPress }, ref) => {
    const mapRef = useRef<any>(null);
    const zoomRef = useRef(0.05);
    const { latitude, longitude } = useLocationStore();
    const { member } = useCurrentMember();
    const { fetchThreads } = useFetchMapThreads();
    const [region, setRegion] = useState<Region | null>(null);
    const [clusters, setClusters] = useState<any[][]>([]);

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

    return (
      <View style={styles.container}>
        <AppMapView
          ref={mapRef}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.978,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {latitude && longitude && (
            <AppMapCurrentMarker latitude={latitude} longitude={longitude} />
          )}

          {/* ✅ 클러스터 마커 */}
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

        {/* ✅ 검색 버튼 */}
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
