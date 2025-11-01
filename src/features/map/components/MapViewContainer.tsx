import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocationStore } from '@/features/location/state/locationStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useFetchMapThreads } from '@/features/map/hooks/useFetchMapThreads';

const MapViewContainer = () => {
  const { latitude, longitude } = useLocationStore();
  const { member } = useCurrentMember();

  // ✅ 훅은 무조건 호출
  const { data: threads, isLoading } = useFetchMapThreads({
    latitude,
    longitude,
    memberId: member?.id,
    enabled: true, // 기본값이 true라 생략도 가능
  });

  // ✅ 위치 미확인 or 로딩 중일 때 UI 처리
  if (!latitude || !longitude) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.text}>현재 위치를 불러오는 중...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.text}>지도 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {threads?.map(thread => (
        <Marker
          key={thread.threadId}
          coordinate={{
            latitude: thread.latitude,
            longitude: thread.longitude,
          }}
          title={thread.description || '(내용 없음)'}
        />
      ))}
    </MapView>
  );
};

export default MapViewContainer;

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { marginTop: 8, color: '#888' },
});
