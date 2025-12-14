import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemberProfileScreen from '@/screens/member/MemberProfileScreen';
import DetailThreadScreen from '@/screens/thread/DetailThreadScreen';
import DetailThreadCommentScreen from '@/screens/thread/DetailThreadCommentScreen';
import ProfileEditScreen from '@/screens/member/ProfileEditScreen';
import PaymentHistoryScreen from '@/screens/payment/PaymentHistoryScreen';
import ChatListScreen from '@/screens/chat/ChatListScreen';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';
import ChatRoomMenuScreen from '@/screens/chat/ChatRoomMenuScreen';
import LanguageSettingScreen from '@/screens/profile/LanguageSettingScreen';
import AttachMyThreadModal from '@/screens/thread/AttachMyThreadModal';

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
      <Stack.Screen name="LanguageSetting" component={LanguageSettingScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="DetailThread" component={DetailThreadScreen} />
      <Stack.Screen
        name="DetailThreadComment"
        component={DetailThreadCommentScreen}
      />
      <Stack.Screen
        name="AttachMyThreadModal"
        component={AttachMyThreadModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="PaymentHistoryScreen"
        component={PaymentHistoryScreen}
      />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
      <Stack.Screen name="ChatRoomMenuScreen" component={ChatRoomMenuScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
