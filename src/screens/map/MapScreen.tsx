// 📄 src/screens/map/MapScreen.tsx
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapViewContainer from '@/features/map/components/MapViewContainer';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { fetchMapThreads } from '@/features/map/api/fetchMapThreads';
import { openMapThreadListSheet } from '@/features/map/sheets/openMapThreadListSheet';
import { COLORS } from '@/common/styles';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

const MapScreen = () => {
  const { member } = useCurrentMember();
  const { close } = useBottomSheetStore(); // ✅ 전역 바텀시트 close 액션

  /** ✅ 화면 포커스 시 시트 오픈 / 포커스 해제 시 시트 닫기 */
  useFocusEffect(
    useCallback(() => {
      // 진입 시 오픈
      openMapThreadListSheet();

      // 벗어날 때 닫기
      return () => {
        close();
      };
    }, []),
  );

  // ✅ 테스트 API 호출 (나중에 hooks/useFetchMapThreads로 통합)
  useEffect(() => {
    const testFetch = async () => {
      if (!member?.id) {
        console.log('⚠️ [MapScreen] memberId 없음 → API 테스트 생략');
        return;
      }

      try {
        const res = await fetchMapThreads({
          latitude: 37.5665,
          longitude: 126.978,
          distance: 90000000,
          memberId: member.id,
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
      <MapViewContainer memberId={member?.id} />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
