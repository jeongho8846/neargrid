// 📄 src/screens/thread/ThreadCreateScreen.tsx
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useChatWebSocket } from '@/features/chat/hooks/useChatWebSocketTest';

const ThreadCreateScreen = () => {
  const { connected, sendChatMessage } = useChatWebSocket(
    '690851265852216817',
    true,
  );

  useEffect(() => {
    console.log('💬 ThreadCreateScreen mounted → useChatWebSocket 활성화');
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        gap: SPACING.md,
      }}
    >
      <AppText style={{ color: COLORS.title, marginBottom: 8 }}>
        {connected
          ? '🟢 WebSocket 연결됨 (로그는 콘솔 확인)'
          : '🔴 연결 중... (로그 확인)'}
      </AppText>

      <Button
        title="📤 테스트 메시지 전송"
        onPress={() => {
          sendChatMessage('/app/chat.sendMessage', {
            chatRoomId: 'test-room',
            senderId: '682867966802399783',
            content: '테스트 메시지입니다.',
          });
        }}
        color={COLORS.button_active}
      />
    </View>
  );
};

export default ThreadCreateScreen;
