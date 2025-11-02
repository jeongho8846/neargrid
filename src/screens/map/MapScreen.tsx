import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapViewContainer from '@/features/map/components/MapViewContainer';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { openMapThreadListSheet } from '@/features/map/sheets/openMapThreadListSheet';
import { COLORS } from '@/common/styles';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useFetchMapThreads } from '@/features/map/hooks/useFetchMapThreads';
import { useMapThreadStore } from '@/features/map/state/mapThreadStore';

const MapScreen = () => {
  const { member } = useCurrentMember();
  const { close } = useBottomSheetStore();

  /** 🧭 Zustand store (지도 스레드 상태) */
  const { threads, setThreads, clearThreads } = useMapThreadStore();

  /** ✅ 데이터 로드 훅 */
  const { fetchThreads, loading } = useFetchMapThreads();

  /** ✅ 회원 정보 변경 시 데이터 갱신 */
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

  /** ✅ 화면 포커스 시 바텀시트 오픈 / 이탈 시 닫기 */
  useFocusEffect(
    useCallback(() => {
      openMapThreadListSheet(); // ✅ 이제 threads는 store에서 자동 구독
      return () => close();
    }, []),
  );

  return (
    <View style={styles.container}>
      <MapViewContainer
        memberId={member?.id}
        threads={threads}
        isLoading={loading}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
