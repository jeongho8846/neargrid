import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { useRefresh } from '@/features/member/hooks/useRefresh';
import { memberStorage } from '@/features/member/utils/memberStorage';
import { useAuthStore } from '@/common/state/authStore'; // ✅ 추가
import { ChatProvider } from '@/features/chat/context/ChatContext';

const Stack = createNativeStackNavigator();

/**
 * ✅ 로그인된 사용자 전용 래퍼
 * - ChatProvider를 여기서 감싸주어 로그인 상태에서만 웹소켓이 돌게 함
 */
const AuthenticatedMain = () => (
  <ChatProvider>
    <MainTabNavigator />
  </ChatProvider>
);

const RootNavigator = () => {
  const [booting, setBooting] = useState(true);
  const { refresh } = useRefresh();
  const { isAuth, setIsAuth } = useAuthStore(); // ✅ Zustand 상태

  useEffect(() => {
    const bootstrap = async () => {
      try {
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
      } finally {
        setBooting(false);
      }
    };
    bootstrap();
  }, [refresh, setIsAuth]);

  if (booting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuth ? (
        <Stack.Screen name="Main" component={AuthenticatedMain} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
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
