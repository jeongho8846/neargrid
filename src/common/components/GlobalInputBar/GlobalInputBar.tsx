// src/common/components/GlobalInputBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Keyboard,
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
  const { isVisible, text, placeholder, setText, onSubmit, isFocusing } =
    useGlobalInputBarStore();
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const [inputHeight, setInputHeight] = useState(LINE_HEIGHT * 1);

  const keyboard = useAnimatedKeyboard();

  // ✅ 키보드 애니메이션
  const animatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = keyboard.height.value;
    const translateY = keyboardHeight > 0 ? -keyboardHeight : 0;
    return {
      transform: [{ translateY: withTiming(translateY, { duration: 100 }) }],
    };
  });

  // ✅ 옵션 기반 포커싱 (isFocusing === true일 때만)
  useEffect(() => {
    if (isVisible && isFocusing && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isVisible, isFocusing]);

  if (!isVisible) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText('');
    Keyboard.dismiss();
  };

  // ✅ 높이 계산
  const handleContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const newHeight = e.nativeEvent.contentSize.height;
    const maxHeight = LINE_HEIGHT * MAX_LINES + SPACING.sm * 2;
    const adjustedHeight = newHeight + SPACING.sm * 1.5;
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
          autoFocus={false}
          scrollEnabled={inputHeight >= LINE_HEIGHT * MAX_LINES}
          onContentSizeChange={handleContentSizeChange}
          textAlignVertical="top"
          underlineColorAndroid="transparent"
          blurOnSubmit={false}
          onSubmitEditing={() => {}}
          returnKeyType="default"
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <AppIcon type="ion" name="send" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ✅ 스타일 수정본
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    // 핵심: 부모를 풀폭으로 두고, 내부 자식을 가운데 정렬
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'transparent',
    borderColor: COLORS.border,
    zIndex: 9999,
    elevation: 10,
    // ⛔️ width / alignSelf / alignContent 제거!
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.sheet_background,
    borderRadius: 18,

    // 핵심: 자식 자체의 너비와 중앙 배치
    width: '96%',
    maxWidth: 720,
    alignSelf: 'center',

    // 살짝 띄우고 싶으면 bottom 대신 marginBottom 사용 권장
    marginBottom: 6,
  },
  input: {
    flex: 1,
    flexShrink: 1,
    ...FONT.body,
    color: COLORS.text,
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: SPACING.md,
    borderRadius: 18,
    backgroundColor: COLORS.sheet_background,
    paddingTop: LINE_HEIGHT * 0.5,
  },
  sendBtn: {
    marginLeft: SPACING.sm,
    paddingBottom: 2,
  },
});

export default GlobalInputBar;
