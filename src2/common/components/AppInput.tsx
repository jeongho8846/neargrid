import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AppText from './AppText';
import { COLORS, SPACING, RADIUS, FONT } from '../styles/tokens';

type Props = {
  tKey?: string;
  value: string;
  placeholder?: string;
  onChangeText: (v: string) => void;
  errorTKey?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

export default function AppInput({
  tKey,
  value,
  placeholder,
  onChangeText,
  errorTKey,
  secureTextEntry,
  multiline,
}: Props) {
  return (
    <View style={styles.container}>
      {tKey && <AppText tKey={tKey} variant="label" style={styles.label} />}
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text_secondary}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
      {errorTKey && (
        <AppText tKey={errorTKey} variant="caption" style={styles.error} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  input: {
    ...FONT.body,
    borderWidth: 1,
    borderColor: COLORS.border_light,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text_primary,
    backgroundColor: COLORS.surface,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
