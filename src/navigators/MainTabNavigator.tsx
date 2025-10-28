import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MapStack from './stackNavigator/main/MapStack';
import FeedStack from './stackNavigator/main/FeedStack';
import ProfileStack from './stackNavigator/main/ProfileStack';
import CustomTabBar from './components/CustomTabBar';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const Tab = createBottomTabNavigator();

/** ✅ 아이콘 렌더러 */
function renderTabIcon(routeName: string, color: string, size: number) {
  let iconName: string = 'ellipse';
  switch (routeName) {
    case 'Map':
      iconName = 'map';
      break;
    case 'FeedStack':
      iconName = 'trophy';
      break;
    case 'Add':
      iconName = 'add-circle';
      break;
    case 'Notification':
      iconName = 'notifications';
      break;
    case 'Profile':
      iconName = 'person';
      break;
  }
  return <Ionicons name={iconName} size={size} color={color} />;
}

/** ✅ 메인 탭 네비게이터 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.nav_active,
        tabBarInactiveTintColor: COLORS.nav_inactive,
        tabBarLabelStyle: {
          ...FONT.caption,
          color: COLORS.text,
        },
        tabBarIcon: ({ color, size }) => renderTabIcon(route.name, color, size),
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{ tabBarLabel: '지도' }}
      />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{ tabBarLabel: '피드' }}
      />
      <Tab.Screen
        name="Add"
        component={FeedStack}
        options={{ tabBarLabel: '추가' }}
      />
      <Tab.Screen
        name="Notification"
        component={MapStack}
        options={{ tabBarLabel: '알림' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: '프로필' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
