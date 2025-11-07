// src2/app/navigation/RootStack.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import MainTab from './MainTab';
import SigninScreen from '@/screens/SigninScreen';

export type RootStackParamList = {
  MainTab: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const [initialRoute, setInitialRoute] = useState<'MainTab' | 'Login' | null>(
    null,
  );

  useEffect(() => {
    /** ✅ 테스트용 로그인 상태 하드코딩 */
    const mockIsLoggedIn = true; // 🔁 ← true/false 바꿔서 테스트 가능

    setTimeout(() => {
      setInitialRoute(mockIsLoggedIn ? 'MainTab' : 'Login');
    }, 500); // 로딩 효과만 잠깐 줌
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="Login" component={SigninScreen} />
    </Stack.Navigator>
  );
}
