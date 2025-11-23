import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapStack from './stackNavigator/main/MapStack';
import FeedStack from './stackNavigator/main/FeedStack';
import ProfileStack from './stackNavigator/main/ProfileStack';
import CustomTabBar from './components/CustomTabBar';
import { COLORS } from '@/common/styles/colors';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useLocationWatcher } from '@/features/location/hooks/useLocationWatcher';
import CreateStack from './stackNavigator/main/CreateStack';
import ChatStack from './stackNavigator/main/ChatStack';
import AlarmStack from './stackNavigator/main/AlarmStack';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { member } = useCurrentMember();
  const { t } = useTranslation(); // ✅ 번역 훅

  React.useEffect(() => {
    console.log('🧭 [MainTabNavigator] member 변경됨:', member);
  }, [member]);

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.nav_active,
        tabBarInactiveTintColor: COLORS.nav_inactive,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';
          switch (route.name) {
            case 'Map':
              iconName = 'map-outline';
              break;
            case 'FeedStack':
              iconName = 'browsers-outline';
              break;
            case 'Add':
              iconName = 'add-circle';
              break;
            case 'Chat':
              iconName = 'chatbubbles-outline';
              break;
            case 'Alarm':
              iconName = 'notifications-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{ tabBarLabel: t('STR_MAP') }} // ✅ 번역
      />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{ tabBarLabel: t('STR_FEED') }} // ✅ 번역
      />
      <Tab.Screen
        name="Add"
        component={CreateStack}
        options={{ tabBarLabel: t('STR_CONTENTS_CREATE_TITLE') }} // ✅ 번역
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ tabBarLabel: t('STR_CHAT') }} // ✅ 번역
      />

      <Tab.Screen
        name="Alarm"
        component={AlarmStack}
        options={{ tabBarLabel: t('STR_ALARM') }} // ✅ 번역
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        initialParams={{ memberId: member?.id }}
        options={{ tabBarLabel: t('STR_PROFILE') }} // ✅ 번역
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
