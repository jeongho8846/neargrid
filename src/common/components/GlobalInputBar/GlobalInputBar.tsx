import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
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

const MAX_LINES = 3;
const LINE_HEIGHT = FONT.body.fontSize ?? 20;

const GlobalInputBar = () => {
  const { isVisible, text, placeholder, setText, onSubmit, close } =
    useGlobalInputBarStore();
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const [inputHeight, setInputHeight] = useState(LINE_HEIGHT * 1); // 기본 1줄 정도 높이

  const keyboard = useAnimatedKeyboard();

  // ✅ 키보드에 따라 인풋바 이동
  const animatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = keyboard.height.value;
    const translateY = keyboardHeight > 0 ? -keyboardHeight : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: 100 }) }],
    };
  });

  // ✅ 자동 포커스
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

  // ✅ 높이 계산 (패딩 보정 포함)
  const handleContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const newHeight = e.nativeEvent.contentSize.height;
    const maxHeight = LINE_HEIGHT * MAX_LINES + SPACING.sm * 2; // padding 고려
    const adjustedHeight = newHeight + SPACING.sm * 1.5; // ✅ 보정치 추가
    setInputHeight(Math.min(adjustedHeight, maxHeight));
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
          style={[
            styles.input,
            {
              height: inputHeight,
              maxHeight: LINE_HEIGHT * MAX_LINES + SPACING.sm * 2,
            },
          ]}
          placeholder={placeholder ?? '댓글을 입력하세요...'}
          placeholderTextColor={COLORS.text_secondary}
          value={text}
          onChangeText={setText}
          multiline
          autoFocus
          scrollEnabled={inputHeight >= LINE_HEIGHT * MAX_LINES} // ✅ 내부 스크롤
          onContentSizeChange={handleContentSizeChange}
          textAlignVertical="top"
          underlineColorAndroid="transparent"
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
    left: 0,
    right: 0,
    backgroundColor: COLORS.sheet_background,
    borderColor: COLORS.border,
    zIndex: 9999,
    elevation: 10,
    borderTopWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center', // ✅ 세로 가운데 정렬 (flex-end → center)
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs, // ✅ 상하 패딩 최소화
  },
  input: {
    flex: 1,
    flexShrink: 1,
    ...FONT.body,
    color: COLORS.text,
    height: 36, // ✅ 명시적으로 기본 높이 지정
    paddingVertical: 0, // ✅ 내부 여백 제거
    paddingHorizontal: SPACING.md,
    borderRadius: 18,
    backgroundColor: COLORS.sheet_background,
    paddingTop: LINE_HEIGHT * 0.5,
  },

  sendBtn: {
    marginLeft: SPACING.sm,
    paddingBottom: 2, // ✅ 살짝 정렬 보정
  },
});

export default GlobalInputBar;
