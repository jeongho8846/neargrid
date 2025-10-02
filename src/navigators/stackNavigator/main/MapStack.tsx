import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../../../screens/map/MapScreen';

const Stack = createNativeStackNavigator();

const MapStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Map" component={MapScreen} />
  </Stack.Navigator>
);

export default MapStack;
