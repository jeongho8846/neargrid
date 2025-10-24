import React, { useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { FONT } from '@/common/styles/typography';
import AppIcon from '../AppIcon';

const GlobalInputBar = () => {
  const { isVisible, text, placeholder, setText, onSubmit, close } =
    useGlobalInputBarStore();
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  // ✅ Reanimated 키보드 훅
  const keyboard = useAnimatedKeyboard();

  // ✅ 애니메이션 스타일 정의
  const animatedStyle = useAnimatedStyle(() => {
    // 키보드 높이에 따라 자연스럽게 위로 이동
    const offset =
      Platform.OS === 'ios'
        ? keyboard.height.value
        : keyboard.height.value - insets.bottom;

    return {
      transform: [
        {
          translateY: withTiming(-offset, { duration: 5 }),
        },
      ],
    };
  }, [insets.bottom]);

  // ✅ 인풋바 열릴 때 자동 포커스
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText('');
    close();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        animatedStyle,
        { paddingBottom: insets.bottom || 10 },
      ]}
    >
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder ?? '댓글을 입력하세요...'}
          placeholderTextColor={COLORS.text_secondary}
          value={text}
          onChangeText={setText}
          multiline
          autoFocus
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <AppIcon type="ion" name="send" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    zIndex: 9999,
    elevation: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    ...FONT.body,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  sendBtn: { marginLeft: SPACING.sm },
});

export default GlobalInputBar;
