// 📄 src/common/components/GlobalInputBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (isVisible && isFocusing && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isVisible, isFocusing]);

  useEffect(() => {
    const handleShow = (e: KeyboardEvent) =>
      setKeyboardHeight(e.endCoordinates.height);
    const handleHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener('keyboardDidShow', handleShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!isVisible) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText('');
  };

  const handleContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const newHeight = e.nativeEvent.contentSize.height;
    const maxHeight = LINE_HEIGHT * MAX_LINES + SPACING.sm * 2;
    const adjustedHeight = newHeight + SPACING.sm * 1.5;
    setInputHeight(Math.min(adjustedHeight, maxHeight));
  };

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: (insets.bottom || 10) + keyboardHeight },
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
          placeholderTextColor={COLORS.input_placeholder} // ✅ 명확한 placeholder 컬러
          value={text}
          onChangeText={setText}
          multiline
          autoFocus={false}
          scrollEnabled={inputHeight >= LINE_HEIGHT * MAX_LINES}
          onContentSizeChange={handleContentSizeChange}
          textAlignVertical="top"
          underlineColorAndroid="transparent"
          blurOnSubmit={false}
          returnKeyType="default"
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <AppIcon type="ion" name="send" size={22} variant="primary" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GlobalInputBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
    zIndex: 9999,
    elevation: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.sheet_background,
    borderRadius: 18,
    width: '96%',
    maxWidth: 720,
    alignSelf: 'center',
    marginBottom: 6,
  },
  input: {
    flex: 1,
    flexShrink: 1,
    ...FONT.body,
    color: COLORS.input_text,
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: SPACING.md,
    borderRadius: 18,
    paddingTop: LINE_HEIGHT * 0.5,
  },

  sendBtn: {
    marginLeft: SPACING.sm,
    paddingBottom: 2,
  },
});
