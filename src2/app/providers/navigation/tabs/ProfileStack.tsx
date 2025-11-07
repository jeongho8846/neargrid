// /src2/app/providers/navigation/tabs/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemberProfileScreen from '@/screens/MemberProfileScreen';
const Stack = createNativeStackNavigator();
export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={MemberProfileScreen} />
    </Stack.Navigator>
  );
}
