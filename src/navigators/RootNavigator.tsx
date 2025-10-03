import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { useRefresh } from '@/features/member/hooks/useRefresh';
import { tokenStorage } from '@/features/member/utils/tokenStorage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const { refresh } = useRefresh();

  useEffect(() => {
    const bootstrap = async () => {
      const user = await tokenStorage.getUserInfo();
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
  }, []);

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
