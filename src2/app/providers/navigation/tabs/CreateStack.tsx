// /src2/app/providers/navigation/tabs/CreateStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreen from '@/screens/CreateScreen';
const Stack = createNativeStackNavigator();
export default function CreateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateScreen" component={CreateScreen} />
    </Stack.Navigator>
  );
}
