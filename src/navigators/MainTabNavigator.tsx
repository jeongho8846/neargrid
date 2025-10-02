import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapStack from './stackNavigator/main/MapStack';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="MapTab" component={MapStack} />
  </Tab.Navigator>
);

export default MainTabNavigator;
