import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, FONT } from '../../styles';
import AppText from '../AppText';

type Props = TextInputProps & {
  labelKey?: string;
  placeholderKey?: string;
  error?: string;
  nextInputRef?: React.RefObject<TextInput | null>; // ✅ null 허용
};

const AppInput = forwardRef<TextInput, Props>(
  ({ labelKey, placeholderKey, error, style, nextInputRef, ...rest }, ref) => {
    return (
      <View style={{ marginBottom: SPACING.md }}>
        {labelKey && (
          <AppText i18nKey={labelKey} variant="caption" style={styles.label} />
        )}

        <TextInput
          ref={ref} // ✅ forwardRef로 연결
          style={[styles.input, error && styles.errorBorder, style]}
          placeholder={placeholderKey}
          placeholderTextColor={COLORS.border}
          blurOnSubmit={!!nextInputRef ? false : rest.blurOnSubmit}
          returnKeyType={nextInputRef ? 'next' : rest.returnKeyType}
          onSubmitEditing={e => {
            if (nextInputRef?.current) {
              nextInputRef.current.focus(); // ✅ 다음 인풋으로 이동
            }
            if (rest.onSubmitEditing) {
              rest.onSubmitEditing(e); // 기존 핸들러도 실행
            }
          }}
          {...rest}
        />

        {error && (
          <AppText variant="caption" color="error" style={styles.errorText}>
            {error}
          </AppText>
        )}
      </View>
    );
  },
);

export default AppInput;

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: COLORS.text,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: FONT.body.fontSize,
    color: COLORS.text,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
  },
});
