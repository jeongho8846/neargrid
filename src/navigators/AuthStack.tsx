import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from '../screens/auth/SigninScreen';

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
  </Stack.Navigator>
);

export default AuthStack;
