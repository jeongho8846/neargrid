import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatListScreen from '@/screens/chat/ChatListScreen';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';
import ChatRoomMenuScreen from '@/screens/chat/ChatRoomMenuScreen';

const Stack = createNativeStackNavigator();

const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
    <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
    <Stack.Screen name="ChatRoomMenuScreen" component={ChatRoomMenuScreen} />
  </Stack.Navigator>
);

export default ChatStack;
