import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -----------------------------
   🧩 테스트용 임시 모델 정의
----------------------------- */
export type ChatMessageModel = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

/* -----------------------------
   ✅ Node.js WebSocket 전용 훅
----------------------------- */
export function useChatWebSocket(memberId?: string, enabled: boolean = true) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      console.warn('🚫 [useChatWebSocket] disabled 상태로 초기화 중단됨');
      return;
    }

    let isUnmounted = false;
    console.group('🚀 useChatWebSocket - Mount');
    console.log('👤 [MemberID]:', memberId ?? '(없음)');

    const connect = async () => {
      const raw = await AsyncStorage.getItem('accessToken');
      const token = raw?.trim();

      const wsUrl = 'wss://api.neargrid.ai:490/chatConnect-app';
      console.log('🌐 [WS 연결 시도]', wsUrl);

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (isUnmounted) return;
        console.log('✅ WebSocket 연결 성공');
        setConnected(true);

        // STOMP 서버와 유사한 CONNECT 프레임 전송
        const connectFrame = `Authorization:Bearer ${token}`;
        socket.send(connectFrame);
        console.log('프레임1-----------------------');
        console.log(connectFrame);
        console.log('📤 [CONNECT] 프레임 전송 완료');
      };

      socket.onmessage = event => {
        const data = event.data.toString();
        console.log('📩 [MESSAGE 수신]', data);
      };

      socket.onerror = error => {
        console.error('🚨 WebSocket ERROR', error);
      };

      socket.onclose = () => {
        if (isUnmounted) return;
        console.warn('⚡️ WebSocket CLOSED → 자동 재연결 대기중...');
        setConnected(false);
        // 재연결
        setTimeout(connect, 3000);
      };

      socketRef.current = socket;
    };

    connect();

    return () => {
      console.group('🧹 useChatWebSocket - Unmount');
      isUnmounted = true;
      if (socketRef.current) {
        console.log('🔌 WebSocket 연결 종료');
        socketRef.current.close();
        socketRef.current = null;
      }
      console.groupEnd();
      console.groupEnd();
    };
  }, [enabled, memberId]);

  /** ✅ 메시지 전송 */
  const sendChatMessage = (text: string) => {
    console.group('📤 [SEND MESSAGE]');
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('❌ [SEND] WebSocket이 연결되지 않았습니다.');
      console.groupEnd();
      return;
    }

    // 단순 broadcast용 STOMP SEND 프레임
    const frame = `SEND\ndestination:/topic/chat\n\n${JSON.stringify({
      id: Date.now().toString(),
      senderId: memberId,
      content: text,
      createdAt: new Date().toISOString(),
    })}^@`;

    socket.send(frame);
    console.log('✅ [SEND] 메시지 전송 완료:', text);
    console.groupEnd();
  };

  return {
    connected,
    sendChatMessage,
  };
}
