import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlarmScreen from '@/screens/alarm/AlarmScreen';
import ChatListScreen from '@/screens/chat/ChatListScreen';

const Stack = createNativeStackNavigator();

const AlarmStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Alarm" component={ChatListScreen} />
  </Stack.Navigator>
);

export default AlarmStack;
