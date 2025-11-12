// 📄 src/screens/chat/ChatRoomList.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import { Client } from '@stomp/stompjs';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { tokenStorage } from '@/features/member/utils/tokenStorage';

export default function ChatRoomList() {
  const { member } = useCurrentMember();
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /** ✅ 웹소켓 연결 */
  const connectWebSocket = async () => {
    const { accessToken } = await tokenStorage.getTokens();
    if (!accessToken) {
      console.warn('❌ AccessToken 없음 → 웹소켓 연결 안 함');
      return;
    }

    console.log('🌐 STOMP 연결 시도...');
    console.log('맴버', member?.id);
    console.log('토큰', accessToken);

    // ✅ RN 전용 순수 WebSocket 엔드포인트

    const client = new Client({
      brokerURL: 'wss://api.neargrid.ai:490/chatConnect-app', // ✅ SockJS 제거 후 brokerURL 사용
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },

      // @ts-ignore
      forceBase64: true,
      // @ts-ignore
      forceBinaryWSFrames: true,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      debug: msg => {
        if (msg.startsWith('[STOMP]')) console.log(msg);
      },

      onConnect: frame => {
        console.log('✅ STOMP CONNECTED');
        setIsConnected(true);

        const userId = member?.id;
        if (userId) {
          const dest = `/private/${userId}`;
          console.log('📩 개인 채널 구독:', dest);
          client.subscribe(dest, message => {
            console.log('📨 수신 메시지:', message.body);
          });
        }
      },

      onDisconnect: () => {
        console.warn('🛑 STOMP DISCONNECTED');
        setIsConnected(false);
      },

      onWebSocketClose: () => {
        console.warn('⚠️ WebSocket Closed');
        setIsConnected(false);
      },

      onStompError: frame => {
        console.error('❌ STOMP ERROR:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
    });

    stompClientRef.current = client;
    client.activate();
  };

  /** ✅ 컴포넌트 마운트/언마운트 */
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClientRef.current?.active) {
        console.log('🔌 STOMP 연결 해제');
        stompClientRef.current.deactivate();
      }
    };
  }, [member?.id]);

  /** ✅ 재연결 버튼 */
  const handleReconnect = () => {
    console.log('🔁 재연결 버튼 클릭');
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      setTimeout(() => connectWebSocket(), 1000);
    } else {
      connectWebSocket();
    }
  };

  return (
    <View style={styles.container}>
      <AppText>채팅방 목록 화면</AppText>

      <TouchableOpacity style={styles.button} onPress={handleReconnect}>
        <AppText>{isConnected ? '🔌 재연결하기' : '🧩 연결 시도'}</AppText>
      </TouchableOpacity>

      <AppText style={styles.status}>
        상태: {isConnected ? '✅ 연결됨' : '❌ 연결 끊김'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  status: {
    marginTop: 10,
  },
});
