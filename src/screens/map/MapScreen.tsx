import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { useLocationStore } from '@/features/location/state/locationStore';

const MapScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, isAtTop } = useCollapsibleHeader(56);

  // ✅ 전역 위치 값 가져오기
  const { latitude, longitude, altitude } = useLocationStore();

  return (
    <View style={styles.container}>
      {/* ✅ 상단 헤더 */}
      <AppCollapsibleHeader
        titleKey="STR_MAP"
        headerOffset={headerOffset}
        isAtTop={isAtTop}
        onBackPress={() => navigation.goBack()}
      />

      {/* ✅ 위치 값 표시 */}
      <View style={styles.content}>
        <AppText style={styles.label}>현재 위치</AppText>

        {latitude && longitude ? (
          <>
            <AppText style={styles.value}>
              위도 (lat): {latitude.toFixed(6)}
            </AppText>
            <AppText style={styles.value}>
              경도 (lon): {longitude.toFixed(6)}
            </AppText>
            <AppText style={styles.value}>
              고도 (alt): {altitude ?? '정보 없음'}
            </AppText>
          </>
        ) : (
          <AppText style={styles.value}>📍 위치 정보를 불러오는 중...</AppText>
        )}
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 4,
  },
});
