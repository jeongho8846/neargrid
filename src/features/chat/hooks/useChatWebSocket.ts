import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage, StompSubscription, Versions } from '@stomp/stompjs';
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
 * - STOMP 기반 웹소켓 연결 훅 (Native WebSocket 사용)
 */
export function useChatWebSocket(enabled: boolean = true) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  /**
   * 🔹 토큰 로드
   */
  useEffect(() => {
    let isMounted = true;

    const loadToken = async () => {
      try {
        const { accessToken: token } = await tokenStorage.getTokens();
        if (isMounted && token && token !== accessToken) {
          console.log('🔑 [WebSocket] New AccessToken loaded');
          setAccessToken(token);
        }
      } catch (e) {
        console.error('❌ [WebSocket] Token load error:', e);
      }
    };

    if (!enabled) return;

    loadToken();
    const interval = setInterval(loadToken, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [enabled, accessToken]);

  /**
   * 🔹 WebSocket + STOMP 연결
   */
  useEffect(() => {
    if (!enabled || !accessToken) return;

    if (isTokenExpired(accessToken)) {
      console.warn('🔒 [WebSocket] 토큰 만료 → 연결 시도 중단');
      return;
    }

    const baseUrl = CHAT_API_BASE_URL
      .replace(/^https:\/\//, 'wss://')
      .replace(/^http:\/\//, 'ws://')
      .replace(/\/$/, '');

    console.log('🔌 [WebSocket] Base URL:', baseUrl);

    const endpoint = `${baseUrl}/chatConnectApp`;
    console.log('🔌 [WebSocket] Connecting to:', endpoint);



    const client = new Client({

      brokerURL: endpoint, // (선택사항) 일부 버전에서는 이 설정을 같이 넣어주는 것이 안정적입니다.

      forceBinaryWSFrames: true,    	   // 해당 코드를 추가해주기!
      appendMissingNULLonIncoming: true,   // 해당 코드를 추가해주기!

      webSocketFactory: () => {
        console.log('🧪 [WebSocket] Creating Native WebSocket instance...');



        const ws = new WebSocket(endpoint);

        ws.addEventListener('open', () => console.log('🌐 WS open'));

        ws.addEventListener('error', (e) => console.log('🔴 WS error', e));
        ws.addEventListener('close', (e) => console.log('⚪ WS close', e));
        ws.addEventListener('message', (e) => console.log('📩 WS msg', e.data));

        return ws;

      },

      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },

      debug: (msg) => console.log('🪶 [STOMP]', msg),

      onConnect: () => {
        console.log('✅ [WebSocket] STOMP connected');
        setConnected(true);
      },

      onDisconnect: () => {
        console.warn('⚠️ [WebSocket] STOMP disconnected');
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error(
          '❌ [WebSocket] STOMP error:',
          frame.headers?.message,
          frame.body,
        );
      },
    });

    client.onUnhandledFrame = (frame) =>
      console.log('🧩 [STOMP] unhandled frame', frame);
    client.onUnhandledMessage = (msg) =>
      console.log('📩 [STOMP] unhandled message', msg);
    client.onUnhandledReceipt = (r) =>
      console.log('🧾 [STOMP] unhandled receipt', r);

    client.onWebSocketError = (e) =>
      console.log('🔴 [STOMP] WS error', e);
    client.onWebSocketClose = (e) =>
      console.log('⚪ [STOMP] WS close', e);

    client.activate();
    clientRef.current = client;

    const checkInterval = setInterval(() => {
      if (client.connected && !connected) {
        console.log('🤝 [WebSocket] Connection verified');
        setConnected(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => {
      console.log('🔌 [WebSocket] Deactivating...');
      clearInterval(checkInterval);
      client.deactivate();
      setConnected(false);
    };
  }, [enabled, accessToken]);

  /**
   * 🔹 Subscribe
   */
  const subscribe = useCallback(
    (
      destination: string,
      callback: (
        data: ChatMessageResponseDto | ChatRoomResponseDto | AlarmModel,
      ) => void,
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
   * 🔹 Publish
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
   * 🔹 Read 처리
   */
  const sendReadChatMessage = useCallback(
    (chatRoomId: string, memberId: string, lastReadChatMessageId: string) => {
      const c = clientRef.current;
      if (!c || !c.connected) {
        console.error('❌ [WebSocket] 연결되지 않음. 읽음 처리 불가');
        return;
      }

      const payload = {
        currentChatRoomId: chatRoomId,
        currentMemberId: memberId,
        lastReadChatMessageId,
      };

      c.publish({
        destination: '/app/memberChatRoom/readChatMessage',
        body: JSON.stringify(payload),
      });

      console.log('✅ [WebSocket] 읽음 처리 전송:', chatRoomId);
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
