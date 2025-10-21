import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '@/screens/feed/FeedScreen';

const Stack = createNativeStackNavigator();

const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={FeedScreen} />
  </Stack.Navigator>
);

export default FeedStack;
