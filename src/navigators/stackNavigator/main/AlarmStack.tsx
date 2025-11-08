import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlarmScreen from '@/screens/alarm/AlarmScreen';

const Stack = createNativeStackNavigator();

const AlarmStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Alarm" component={AlarmScreen} />
  </Stack.Navigator>
);

export default AlarmStack;
