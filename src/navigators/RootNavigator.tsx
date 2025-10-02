import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { useRefresh } from '@/features/member/hooks/useRefresh';
import { tokenStorage } from '@/features/member/utils/tokenStorage';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const { refresh } = useRefresh();

  useEffect(() => {
    const bootstrap = async () => {
      // 1) 로컬 확인 → 있으면 바로 Main으로
      const user = await tokenStorage.getUserInfo();
      if (user) {
        setIsAuth(true);

        // 2) 뒤에서 refresh 호출 (실패하면 튕기기)
        const { success } = await refresh();
        if (!success) {
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
    };

    bootstrap();
  }, []);

  if (isAuth === null) {
    // 앱 첫 부팅 시 로딩
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth">
            {() => <AuthStack setIsAuth={setIsAuth} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
