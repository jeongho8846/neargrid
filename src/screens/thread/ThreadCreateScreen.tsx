// 📄 src/screens/thread/ThreadCreateScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useStompChatClient } from '@/features/chat/hooks/useChatWebSocketTest';

const ThreadCreateScreen = () => {
  const { connected, sendMessage } = useStompChatClient({
    memberId: '682867966802399783', // 현재 로그인된 사용자 ID
    enabled: true,
  });

  useEffect(() => {
    if (connected) {
      console.log('🎉 [ChatTest] Connected to WebSocket');
    }
  }, [connected]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button
        title="Send Test Message"
        onPress={() =>
          sendMessage('/app/chat.send', { text: 'Hello from nearGrid' })
        }
      />
    </View>
  );
};

export default ThreadCreateScreen;
