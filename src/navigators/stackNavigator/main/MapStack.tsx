import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../../../screens/map/MapScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';

const Stack = createNativeStackNavigator();

const MapStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
  </Stack.Navigator>
);

export default MapStack;
