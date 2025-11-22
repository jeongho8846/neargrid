import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlarmScreen from '@/screens/alarm/AlarmScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';

const Stack = createNativeStackNavigator();

const AlarmStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Alarm" component={AlarmScreen} />
    <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
  </Stack.Navigator>
);

export default AlarmStack;
