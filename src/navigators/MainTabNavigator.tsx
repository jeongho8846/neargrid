import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MapStack from './stackNavigator/main/MapStack';
import CustomTabBar from './components/CustomTabBar'; // 👈 커스텀 탭바
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const Tab = createBottomTabNavigator();

// ✅ 아이콘 렌더러
function renderTabIcon(routeName: string, color: string, size: number) {
  let iconName: string = 'ellipse';

  switch (routeName) {
    case 'Map':
      iconName = 'map';
      break;
    case 'Ranking':
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

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />} // 👈 커스텀 탭바 적용
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
        name="Ranking"
        component={MapStack}
        options={{ tabBarLabel: '랭킹' }}
      />
      <Tab.Screen
        name="Add"
        component={MapStack}
        options={{ tabBarLabel: '추가' }}
      />
      <Tab.Screen
        name="Notification"
        component={MapStack}
        options={{ tabBarLabel: '알림' }}
      />
      <Tab.Screen
        name="Profile"
        component={MapStack}
        options={{ tabBarLabel: '프로필' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
