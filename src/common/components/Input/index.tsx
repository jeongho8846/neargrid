import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, FONT } from '../../styles';
import AppText from '../AppText';
import { useTranslation } from 'react-i18next';

type Props = TextInputProps & {
  labelKey?: string;
  placeholderKey?: string;
  error?: string;
  nextInputRef?: React.RefObject<TextInput | null>;
};

const AppInput = forwardRef<TextInput, Props>(
  ({ labelKey, placeholderKey, error, style, nextInputRef, ...rest }, ref) => {
    const { t } = useTranslation(); // ✅ i18n hook 사용

    return (
      <View style={{ marginBottom: SPACING.md }}>
        {labelKey && (
          <AppText i18nKey={labelKey} variant="caption" style={styles.label} />
        )}

        <TextInput
          ref={ref}
          style={[styles.input, error && styles.errorBorder, style]}
          placeholder={placeholderKey ? t(placeholderKey) : undefined} // ✅ 번역 처리
          placeholderTextColor={COLORS.border}
          blurOnSubmit={!!nextInputRef ? false : rest.blurOnSubmit}
          returnKeyType={nextInputRef ? 'next' : rest.returnKeyType}
          onSubmitEditing={e => {
            if (nextInputRef?.current) {
              nextInputRef.current.focus();
            }
            if (rest.onSubmitEditing) {
              rest.onSubmitEditing(e);
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
    color: COLORS.body,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.input_background,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: FONT.body.fontSize,
    color: COLORS.body,
    flexShrink: 1, // ✅ 부모 영역 안에서 줄바꿈되어도 가로길이 고정
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
  },
});
