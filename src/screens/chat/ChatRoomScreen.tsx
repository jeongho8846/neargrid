// 📄 src/features/chat/screens/ChatRoomScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetChatRoomMessageHistory } from '@/features/chat/hooks/useGetChatRoomMessageHistory';
import ChatMessageList from '@/features/chat/lists/ChatMessageList';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * ✅ 채팅방 화면
 * - route.params.chatRoomId 기반 메시지 불러오기
 * - AppFlashList 기반 ChatMessageList 사용
 */
const ChatRoomScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { chatRoomId } = route.params;
  const { open, close, isVisible } = useGlobalInputBarStore();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetChatRoomMessageHistory(chatRoomId);

  // 🔹 messages 평탄화
  const messages = data?.pages.flatMap(page => page.messages || []) ?? [];

  // 🔹 메뉴로 이동
  const handleOpenMenu = () => {
    navigation.navigate('ChatRoomMenuScreen', { roomId: chatRoomId });
  };

  // 🔹 글로벌 인풋 바 열기/닫기
  React.useEffect(() => {
    open({
      placeholder: '메시지를 입력하세요...',
      isFocusing: true,
      onSubmit: text => {
        // TODO: 서버 전송 로직 연동 (웹소켓/HTTP)
        console.log('✉️ send chat', { chatRoomId, text });
      },
    });
    return () => {
      close();
    };
  }, [chatRoomId, open, close]);

  // 🔹 리스트는 scaleY로 뒤집혀 있으므로, 키보드/인풋바 높이만큼 paddingTop을 추가해 겹침 방지
  React.useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.icon_primary} />
      </View>
    );

  if (isError)
    return (
      <View style={styles.center}>
        <AppText onPress={() => refetch()}>불러오기 실패. 다시 시도</AppText>
      </View>
    );

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_CHAT"
        right={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleOpenMenu}>
              <AppIcon
                type="ion"
                name="ellipsis-vertical"
                size={22}
                color={COLORS.body}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.body}>
        <ChatMessageList
          data={messages}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          loadingMore={isFetchingNextPage}
          topPadding={75 + insets.bottom + keyboardHeight}
        />
      </View>
      <GlobalInputBar />
      <BottomBlurGradient height={120}></BottomBlurGradient>
    </View>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 'auto',
    paddingRight: SPACING.sm,
    padding: 1,
  },
  body: { flex: 1 },
});
