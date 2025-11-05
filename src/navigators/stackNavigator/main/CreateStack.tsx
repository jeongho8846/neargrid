// 📄 src/navigators/stackNavigator/main/FootStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🧭 테스트 스크린 5개 import
import DemoMapScreen from '@/test/screens/DemoMapScreen';
import DemoFeedScreen from '@/test/screens/DemoFeedScreen';
import DemoCreateScreen from '@/test/screens/DemoCreateScreen';
import DemoAlarmScreen from '@/test/screens/DemoAlarmScreen';
import DemoProfileScreen from '@/test/screens/DemoProfileScreen';
import DemoSearchScreen from '@/test/screens/DemoSearchScreen';

const Stack = createNativeStackNavigator();

const CreateStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1️⃣ 지도 화면 */}
      <Stack.Screen name="DemoMap" component={DemoMapScreen} />
      {/* 2️⃣ 피드 화면 */}
      <Stack.Screen name="DemoFeed" component={DemoFeedScreen} />
      {/* 3️⃣ 작성 화면 */}
      <Stack.Screen name="DemoCreate" component={DemoCreateScreen} />
      {/* 4️⃣ 알림 화면 */}
      <Stack.Screen name="DemoAlarm" component={DemoAlarmScreen} />
      {/* 5️⃣ 프로필 화면 */}
      <Stack.Screen name="DemoProfile" component={DemoProfileScreen} />
      <Stack.Screen name="DemoSearch" component={DemoSearchScreen} />
    </Stack.Navigator>
  );
};

export default CreateStack;
