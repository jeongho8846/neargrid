import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { useRefresh } from '@/features/member/hooks/useRefresh';
import { memberStorage } from '@/features/member/utils/memberStorage';

// 🗺 위치 추적 관련
import {
  startWatchingLocation,
  stopWatchingLocation,
  getCurrentLocation,
} from '@/services/device/locationService';
import { useLocationStore } from '@/features/location/state/locationStore';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const { refresh } = useRefresh();
  const { setLocation } = useLocationStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // ✅ 1. 앱 시작 시 즉시 한 번 현재 위치 저장
        const coords = await getCurrentLocation();
        if (coords) {
          setLocation(coords.latitude, coords.longitude);
          console.log(
            '[GPS] 초기 위치 저장:',
            coords.latitude,
            coords.longitude,
          );
        }

        // ✅ 2. 이후 주기적으로 GPS 위치 감시 시작
        startWatchingLocation();

        // ✅ 3. 사용자 정보 확인 및 자동 로그인
        const user = await memberStorage.getMember();
        if (user) {
          setIsAuth(true);
          const { success } = await refresh();
          if (!success) setIsAuth(false);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error('Root bootstrap error:', error);
        setIsAuth(false);
      }
    };

    bootstrap();

    // ✅ 언마운트 시 위치 감시 정리
    return () => {
      stopWatchingLocation();
    };
  }, [refresh, setLocation]);

  if (isAuth === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuth ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth">
          {() => (
            <AuthStack
              setIsAuth={
                setIsAuth as React.Dispatch<React.SetStateAction<boolean>>
              }
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
