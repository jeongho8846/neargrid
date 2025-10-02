import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuth, setIsAuth] = useState(false); // 임시 상태

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen name="Main">{() => <MainTabNavigator />}</Stack.Screen>
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
