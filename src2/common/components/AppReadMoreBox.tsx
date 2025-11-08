import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import type { TextLayoutEvent } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { SPACING } from '../styles/tokens';

type Props = {
  children: string;
  numberOfLines?: number;
};

export default function AppReadMoreBox({ children, numberOfLines = 3 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [debugLineCount, setDebugLineCount] = useState(0);

  const handleTextLayout = useCallback(
    (e: TextLayoutEvent) => {
      const { lines } = e.nativeEvent;
      setDebugLineCount(lines.length);
      if (lines.length >= numberOfLines) {
        setShowMoreButton(true);
      }
    },
    [numberOfLines],
  );

  return (
    <View style={styles.container}>
      <AppText
        variant="body"
        numberOfLines={expanded ? undefined : numberOfLines}
        onTextLayout={handleTextLayout}
      >
        {children}
      </AppText>

      {/* ✅ 디버그 표시 */}
      <AppText variant="caption" align="left" style={styles.debugText}>
        lines: {debugLineCount}
      </AppText>

      {showMoreButton && (
        <AppButton
          variant="ghost"
          onPress={() => setExpanded(prev => !prev)}
          tKey={expanded ? 'STR_COLLAPSE' : 'STR_MORE'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  debugText: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
  },
});
