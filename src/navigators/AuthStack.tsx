import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from '../screens/auth/SigninScreen';
import SignupScreen_checkEmail from '@/screens/auth/SignupScreen_checkEmail';
import SignupScreen_checkAuthNumber from '@/screens/auth/SignupScreen_checkAuthNumber';
import SignupScreen_password from '@/screens/auth/SignupScreen_password';
import SignupScreen_checkNickName from '@/screens/auth/SignupScreen_checkNickName';

const Stack = createNativeStackNavigator();

const AuthStack = ({
  setIsAuth,
}: {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Signin">
      {() => <SigninScreen setIsAuth={setIsAuth} />}
    </Stack.Screen>
    <Stack.Screen
      name="SignupScreen_checkEmail"
      component={SignupScreen_checkEmail}
    />
    <Stack.Screen
      name="SignupScreen_checkAuthNumber"
      component={SignupScreen_checkAuthNumber}
    />
    <Stack.Screen
      name="SignupScreen_password"
      component={SignupScreen_password}
    />
    <Stack.Screen
      name="SignupScreen_checkNickName"
      component={SignupScreen_checkNickName}
    />
  </Stack.Navigator>
);

export default AuthStack;
