import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';

import MapStack from './stackNavigator/main/MapStack';
import FeedStack from './stackNavigator/main/FeedStack';
import ProfileStack from './stackNavigator/main/ProfileStack';
import CustomTabBar from './components/CustomTabBar';
import { COLORS } from '@/common/styles/colors';
import { useLocationWatcher } from '@/features/location/hooks/useLocationWatcher';

const Tab = createBottomTabNavigator();

/** ✅ 권한 요청 함수 */
const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }

    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];

    if (Number(Platform.Version) >= 29) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const fine =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const coarse =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const background =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;

    return Number(Platform.Version) >= 29
      ? fine && coarse && background
      : fine || coarse;
  } catch (err) {
    console.error('[Location Permission Error]', err);
    return false;
  }
};

/** ✅ 메인 탭 네비게이터 */
const MainTabNavigator = () => {
  const [granted, setGranted] = useState(false);

  // ✅ 위치 권한 요청 (최초 1회)
  useEffect(() => {
    (async () => {
      const ok = await requestLocationPermission();
      if (!ok) {
        Alert.alert(
          '위치 권한 필요',
          '지도 및 피드를 사용하려면 위치 권한이 필요합니다.',
        );
      } else {
        console.log('[MainTab] 위치 권한 허용됨 → GPS 감시 시작');
        setGranted(true);
      }
    })();
  }, []);

  // ✅ ✅ Hook은 항상 실행하되, 내부에서 granted 상태에 따라 동작
  useLocationWatcher(granted);

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.nav_active,
        tabBarInactiveTintColor: COLORS.nav_inactive,

        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'ellipse';
          switch (route.name) {
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
