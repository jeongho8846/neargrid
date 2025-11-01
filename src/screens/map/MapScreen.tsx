import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapViewContainer from '@/features/map/components/MapViewContainer';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { fetchMapThreads } from '@/features/map/api/fetchMapThreads';

const MapScreen = () => {
  const { member } = useCurrentMember();

  useEffect(() => {
    const testFetch = async () => {
      if (!member?.id) {
        console.log('⚠️ [MapScreen] memberId 없음 → API 테스트 생략');
        return;
      }

      try {
        console.log('🧭 [MapScreen] 지도 API 테스트 시작');
        const res = await fetchMapThreads({
          latitude: 37.5665,
          longitude: 126.978,
          distance: 90000000,
          memberId: member.id, // ✅ store에서 가져온 memberId 사용
        });
        console.log('✅ [MapScreen] fetchMapThreads 결과:', res);
      } catch (err) {
        console.error('❌ [MapScreen] fetchMapThreads 오류:', err);
      }
    };

    testFetch();
  }, [member?.id]);

  return (
    <View style={styles.container}>
      {member?.id ? (
        <MapViewContainer memberId={member.id} />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  placeholder: { flex: 1, backgroundColor: '#f8f8f8' },
});
