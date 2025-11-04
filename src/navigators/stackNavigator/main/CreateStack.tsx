// 📄 src/navigators/stackNavigator/main/FootStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThreadCreateScreen from '@/screens/thread/ThreadCreateScreen';

const Stack = createNativeStackNavigator();

const CreateStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ThreadCreate" component={ThreadCreateScreen} />
    </Stack.Navigator>
  );
};

export default CreateStack;
