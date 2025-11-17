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

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { member } = useCurrentMember(); // ✅ 현재 로그인된 사용자 정보
  // const granted = true; // (예시) 위치 권한 생략
  // useLocationWatcher(granted);

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
              iconName = 'trophy-outline';
              break;
            case 'Add':
              iconName = 'add-circle';
              break;
            case 'Chat':
              iconName = 'chatbubbles-outline';
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
        options={{ tabBarLabel: '지도' }}
      />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{ tabBarLabel: '피드' }}
      />
      <Tab.Screen
        name="Add"
        component={CreateStack}
        options={{ tabBarLabel: '추가' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ tabBarLabel: '채팅' }}
      />

      {/* ✅ member.id만 전달 (MemberProfileScreen에서 memberId로 받음) */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        initialParams={{ memberId: member?.id }} // 👈 수정 완료!
        options={{ tabBarLabel: '프로필' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
