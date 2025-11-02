// 📄 src/navigators/stackNavigator/main/FootStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FootPrintScreen from '@/screens/map/FootPrintScreen';

const Stack = createNativeStackNavigator();

const FootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FootPrint" component={FootPrintScreen} />
    </Stack.Navigator>
  );
};

export default FootStack;
