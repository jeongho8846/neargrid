import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import CustomTabBar from './components/CustomTabBar';
import MapStack from './tabs/MapStack';
import FeedStack from './tabs/FeedStack';
import CreateStack from './tabs/CreateStack';
import RankingStack from './tabs/RankingStack';
import ProfileStack from './tabs/ProfileStack';

const Tab = createBottomTabNavigator();

export default function MainTab() {
  const getTabBarVisible = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const hiddenScreens = ['DetailThread', 'DetailThreadComment'];
    return hiddenScreens.includes(routeName) ? 'none' : 'flex';
  };

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />} // ✅ 교체
    >
      <Tab.Screen
        name="MapStack"
        component={MapStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisible(route) },
          title: 'Map',
        })}
      />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisible(route) },
          title: 'Feed',
        })}
      />
      <Tab.Screen
        name="CreateStack"
        component={CreateStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisible(route) },
          title: 'Create',
        })}
      />
      <Tab.Screen
        name="RankingStack"
        component={RankingStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisible(route) },
          title: 'Ranking',
        })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisible(route) },
          title: 'Profile',
        })}
      />
    </Tab.Navigator>
  );
}
