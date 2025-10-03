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
  let iconName = 'ellipse';
  if (routeName === 'Map1') iconName = 'map';
  else if (routeName === 'Map2') iconName = 'chatbubble';
  else if (routeName === 'Map3') iconName = 'person';
  else if (routeName === 'Map4') iconName = 'notifications';
  else if (routeName === 'Map5') iconName = 'settings';
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
        name="Map1"
        component={MapStack}
        options={{ tabBarLabel: '지도' }}
      />
      <Tab.Screen
        name="Map2"
        component={MapStack}
        options={{ tabBarLabel: '채팅' }}
      />
      <Tab.Screen
        name="Map3"
        component={MapStack}
        options={{ tabBarLabel: '프로필' }}
      />
      <Tab.Screen
        name="Map4"
        component={MapStack}
        options={{ tabBarLabel: '알림' }}
      />
      <Tab.Screen
        name="Map5"
        component={MapStack}
        options={{ tabBarLabel: '설정' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
