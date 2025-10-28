import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '@/screens/feed/FeedScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/thread/DetailThreadCommentScreen';

const Stack = createNativeStackNavigator();

const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={FeedScreen} />
    <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
    <Stack.Screen
      name="DetailThreadComment"
      component={DetailThreadCommentScreen}
    />
  </Stack.Navigator>
);

export default FeedStack;
