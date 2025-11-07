import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailThreadScreen from '@/screens/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/DetailCommentlThreadScreen';
import ThreadFeedScreen from '@/screens/ThreadFeedScreen';

const Stack = createNativeStackNavigator();

export default function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedScreen" component={ThreadFeedScreen} />
      <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
      <Stack.Screen
        name="DetailThreadComment"
        component={DetailThreadCommentScreen}
      />
    </Stack.Navigator>
  );
}
