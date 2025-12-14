import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlarmScreen from '@/screens/alarm/AlarmScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/thread/DetailThreadCommentScreen';
import AttachMyThreadModal from '@/screens/thread/AttachMyThreadModal';

const Stack = createNativeStackNavigator();

const AlarmStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Alarm" component={AlarmScreen} />
    <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
    <Stack.Screen
      name="DetailThreadComment"
      component={DetailThreadCommentScreen}
    />
    <Stack.Screen
      name="AttachMyThreadModal"
      component={AttachMyThreadModal}
      options={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    />
  </Stack.Navigator>
);

export default AlarmStack;
