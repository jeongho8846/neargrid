// 📄 src/navigators/stackNavigator/main/FootStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContentsCreateScreen from '@/screens/contents/ContentsCreateScreen';

const Stack = createNativeStackNavigator();

const CreateStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DemoMapA" component={ContentsCreateScreen} />
    </Stack.Navigator>
  );
};

export default CreateStack;
