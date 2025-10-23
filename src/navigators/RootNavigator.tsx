import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { useRefresh } from '@/features/member/hooks/useRefresh';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { memberStorage } from '@/features/member/utils/memberStorage';

// ✅ 추가
import { getCurrentLocation } from '@/services/device/locationService';
import { useLocationStore } from '@/features/location/state/locationStore';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const { refresh } = useRefresh();

  // ✅ 위치 저장 훅
  const { setLocation } = useLocationStore();

  useEffect(() => {
    const bootstrap = async () => {
      // 🗺️ 1. 위치 권한 요청 + 좌표 저장
      const coords = await getCurrentLocation();
      if (coords) {
        setLocation(coords.latitude, coords.longitude);
      }

      // 👤 3. 유저 정보 및 자동 로그인
      const user = await memberStorage.getMember();
      if (user) {
        setIsAuth(true);

        const { success } = await refresh();
        if (!success) {
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
    };

    bootstrap();
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
