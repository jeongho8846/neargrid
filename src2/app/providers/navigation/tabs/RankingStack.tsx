// /src2/app/providers/navigation/tabs/RankingStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RankingScreen from '@/screens/RankingScreen';
const Stack = createNativeStackNavigator();
export default function RankingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RankingScreen" component={RankingScreen} />
    </Stack.Navigator>
  );
}
