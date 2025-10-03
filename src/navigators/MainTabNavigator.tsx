// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapStack from './stackNavigator/main/MapStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 20, // 👈 둥근 모서리
          borderTopRightRadius: 20,
          overflow: 'hidden', // 👈 둥근 모서리 밖 배경 안 보이게
          marginLeft: 3,
          marginRight: 3,
        },
        tabBarLabelStyle: {
          ...FONT.caption,
          color: COLORS.text,
        },
        tabBarActiveTintColor: COLORS.nav_active, // ✅ 아이콘/라벨 활성 색
        tabBarInactiveTintColor: COLORS.nav_inactive, // ✅ 아이콘/라벨 비활성 색
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
