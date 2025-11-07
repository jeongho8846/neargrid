// /src2/app/providers/navigation/tabs/MapStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '@/screens/MapScreen';
const Stack = createNativeStackNavigator();
export default function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}
