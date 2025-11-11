import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemberProfileScreen from '@/screens/member/MemberProfileScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/thread/DetailThreadCommentScreen';
import ProfileEditScreen from '@/screens/member/ProfileEditScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = ({ route }) => {
  const memberId = route?.params?.memberId; // ✅ MainTabNavigator에서 전달된 값

  console.log('🧭 [ProfileStack] 받은 memberId:', memberId);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* ✅ 직접 MemberProfileScreen에 전달 */}
      <Stack.Screen
        name="Profile"
        component={MemberProfileScreen}
        initialParams={{ memberId }}
      />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
      <Stack.Screen
        name="DetailThreadComment"
        component={DetailThreadCommentScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
