import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { CHAT_API_BASE_URL } from '@env';
import { tokenStorage } from '@/features/member/utils/tokenStorage';
import { decode as atob } from 'base-64';
import { ChatMessageResponseDto } from '../model/ChatMessageModel';
import { ChatRoomResponseDto } from '../model/ChatRoomModel';
import { AlarmModel } from '@/features/alarm/model/AlarmModel';

/**
 * ✅ JWT 토큰 만료 여부 확인
 */
function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch {
    return true;
  }
}

/**
 * ✅ useChatWebSocket
 * - STOMP 기반 웹소켓 연결 훅
 */
export function useChatWebSocket(enabled: boolean = true) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 🔹 토큰 로드 (AsyncStorage에서 비동기로 가져오기)
  useEffect(() => {
    const loadToken = async () => {
      const { accessToken: token } = await tokenStorage.getTokens();
      if (token) {
        setAccessToken(token);
      }
    };
    if (enabled) {
      loadToken();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !accessToken) return;

    if (isTokenExpired(accessToken)) {
      console.warn('🔒 [WebSocket] 토큰 만료 → 연결 시도 중단');
      return;
    }

    const endpoint = `${CHAT_API_BASE_URL}/chatConnect`;

    const client = new Client({
      // ✅ SockJS 사용 (React Native 환경에서 필요할 수 있는 폴백 및 프로토콜 지원)
      webSocketFactory: () => new SockJS(endpoint),

      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      // ✅ 연결 직전 헤더 주입 (토큰 갱신 등)
      beforeConnect: () => {
        if (!accessToken || isTokenExpired(accessToken)) {
          console.warn('🔒 [WebSocket] 토큰 만료 or 없음 → 연결 취소');
          client.deactivate();
          return;
        }
        client.connectHeaders = {
          ...(client.connectHeaders || {}),
          Authorization: `Bearer ${accessToken}`,
        };
      },

      debug: msg => {
        if (__DEV__) {
          // console.log('[STOMP DEBUG]', msg);
        }
      },

      onConnect: () => {
        console.log('✅ [WebSocket] STOMP connected');
        setConnected(true);
      },

      onDisconnect: () => {
        console.warn('⚠️ [WebSocket] STOMP disconnected');
        setConnected(false);
      },

      onWebSocketClose: () => {
        console.warn('⚡️ [WebSocket] Socket closed. 재연결 시도 중...');
        setConnected(false);
      },

      onStompError: frame => {
        console.error('❌ [WebSocket] STOMP error:', frame.headers.message, frame.body);
      },

      onWebSocketError: e => {
        console.error('❌ [WebSocket] Socket error:', e);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('🔌 [WebSocket] Deactivating...');
      client.deactivate();
      setConnected(false);
    };
  }, [enabled, accessToken]);

  /**
   * 🔹 구독 (Subscribe)
   */
  const subscribe = useCallback(
    (
      destination: string,
      callback: (data: ChatMessageResponseDto | ChatRoomResponseDto | AlarmModel) => void,
    ): StompSubscription | null => {
      if (!clientRef.current || !clientRef.current.connected) {
        console.warn('⚠️ [WebSocket] 연결되지 않음. 구독 불가:', destination);
        return null;
      }

      return clientRef.current.subscribe(destination, (message: IMessage) => {
        try {
          const body = JSON.parse(message.body);
          callback(body);
        } catch (e) {
          console.error('❌ [WebSocket] 메시지 파싱 오류:', e);
        }
      });
    },
    [connected],
  );

  /**
   * 🔹 메시지 전송 (Publish)
   */
  const sendChatMessage = useCallback((destination: string, body: object) => {
    const c = clientRef.current;
    if (!c || !c.connected) {
      console.error('❌ [WebSocket] 연결되지 않음. 전송 불가');
      return;
    }

    c.publish({
      destination,
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  }, []);

  /**
   * 🔹 읽음 처리 전송 (Read Status)
   */
  const sendReadChatMessage = useCallback(
    (chatRoomId: string, memberId: string, lastReadChatMessageId: string) => {
      const c = clientRef.current;
      if (!c || !c.connected) {
        console.error('❌ [WebSocket] 연결되지 않음. 읽음 처리 불가');
        return;
      }

      try {
        const payload = {
          currentChatRoomId: chatRoomId,
          currentMemberId: memberId,
          lastReadChatMessageId: lastReadChatMessageId,
        };

        c.publish({
          destination: '/app/memberChatRoom/readChatMessage',
          body: JSON.stringify(payload),
        });

        console.log('✅ [WebSocket] 읽음 처리 전송:', chatRoomId);
      } catch (e) {
        console.error('❌ [WebSocket] 읽음 처리 중 오류:', e);
      }
    },
    [connected],
  );

  return {
    client: clientRef.current,
    connected,
    subscribe,
    sendChatMessage,
    sendReadChatMessage,
  };
}
