import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { TextLayoutEvent } from 'react-native';
import AppText from './AppText';
import { SPACING, COLORS } from '../styles/tokens';

type Props = {
  children: string;
  numberOfLines?: number;
};

export default function AppReadMoreBox({ children, numberOfLines = 3 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const handleTextLayout = useCallback(
    (e: TextLayoutEvent) => {
      const { lines } = e.nativeEvent;
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

      {showMoreButton && (
        <TouchableOpacity onPress={() => setExpanded(prev => !prev)}>
          <AppText variant="label" style={styles.moreText}>
            {expanded ? '접기' : '더보기'}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
    alignItems: 'flex-start',
  },
  moreText: {
    color: COLORS.text_secondary,
    marginTop: SPACING.xs,
  },
});
