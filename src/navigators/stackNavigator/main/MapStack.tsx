import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '@/screens/map/MapScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/thread/DetailThreadCommentScreen';
import FootPrintScreen from '@/screens/map/FootPrintScreen';
import MemberProfileScreen from '@/screens/member/MemberProfileScreen';

const Stack = createNativeStackNavigator();

const MapStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Map" component={MapScreen} />

    <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
    <Stack.Screen
      name="DetailThreadComment"
      component={DetailThreadCommentScreen}
    />
    <Stack.Screen name="FootPrint" component={FootPrintScreen} />
    <Stack.Screen name="Profile" component={MemberProfileScreen} />
  </Stack.Navigator>
);

export default MapStack;
