import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '@/screens/feed/FeedScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/thread/DetailThreadCommentScreen';
import MemberProfileScreen from '@/screens/member/MemberProfileScreen';
import AttachMyThreadModal from '@/screens/thread/AttachMyThreadModal';

const Stack = createNativeStackNavigator();

const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={FeedScreen} />
    <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
    <Stack.Screen
      name="DetailThreadComment"
      component={DetailThreadCommentScreen}
    />
    <Stack.Screen name="Profile" component={MemberProfileScreen} />
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

export default FeedStack;
