import { Client, Frame } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useRef } from 'react';
/**
 * ✅ Hermès Safe Pure STOMP WebSocket Hook
 * - SockJS 제거
 * - Hermès 엔진 환경에서도 CONNECT 프레임 유실 없이 동작
 * - RN 네이티브 WebSocket 강제 바인딩
 */
export function useChatWebSocketSockJS(memberId?: string) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let isUnmounted = false;

    // ✅ Hermès에서 JS → Native WebSocket 이벤트 누락 방지
    try {
      const RNWebSocket = require('react-native/Libraries/WebSocket/WebSocket');
      if (global.WebSocket !== RNWebSocket) {
        (global as any).WebSocket = RNWebSocket;
        console.log('🔧 [HermèsSafe] WebSocket polyfill applied');
      }
    } catch (e) {
      console.warn('⚠️ [HermèsSafe] WebSocket polyfill failed:', e);
    }

    const connect = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('⚠️ accessToken 없음');
        return;
      }

      const wsUrl = 'wss://api.neargrid.ai:490/chatConnect-app';

      console.group('🚀 [useChatWebSocketSockJS]');
      console.log('🔑 Token:', token);
      console.log('👤 MemberID:', memberId);
      console.log('🌐 WebSocket URL:', wsUrl);
      console.groupEnd();

      // ✅ STOMP 클라이언트 생성
      const client = new Client({
        webSocketFactory: () => new WebSocket(wsUrl, 'v12.stomp'),
        connectHeaders: {
          authorization: `Bearer ${token}`, // 반드시 소문자 key
        },
        debug: msg => {
          if (msg.startsWith('>>>')) console.log('⬆️', msg);
          else if (msg.startsWith('<<<')) console.log('⬇️', msg);
          else console.log('🪶', msg);
        },
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        reconnectDelay: 5000,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 0,

        onConnect: (frame: Frame) => {
          if (isUnmounted) return;
          console.log('✅ [STOMP CONNECTED]');
          console.log('📜 [HEADERS]', frame.headers);
          setConnected(true);
        },

        onStompError: frame => {
          console.log('❌ [STOMP ERROR]', frame.body);
          setConnected(false);
        },

        onWebSocketError: err => {
          console.log('🚨 [WS ERROR]', err);
          setConnected(false);
        },
      });

      client.activate();
      clientRef.current = client;

      // ✅ Hermès에서 CONNECT 프레임 지연 방지 (polling)
      const confirmInterval = setInterval(() => {
        if (client.connected) {
          clearInterval(confirmInterval);
          console.log('🤝 [HermèsSafe] CONNECT confirmed');
          setConnected(true);
        }
      }, 500);

      // 10초 후에도 연결 안되면 timeout 로그
      setTimeout(() => {
        clearInterval(confirmInterval);
        if (!client.connected) {
          console.warn('⏱️ [HermèsSafe] STOMP CONNECT timeout');
        }
      }, 10000);
    };

    connect();

    return () => {
      isUnmounted = true;
      setConnected(false);
      clientRef.current?.deactivate();
    };
  }, [memberId]);

  return { connected };
}
