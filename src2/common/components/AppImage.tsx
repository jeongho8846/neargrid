import React from 'react';
import FastImage, { FastImageProps } from '@d11/react-native-fast-image';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/tokens';

export default function AppImage({ style, ...rest }: FastImageProps) {
  return (
    <View style={[styles.container, style]}>
      <FastImage
        {...rest}
        style={StyleSheet.absoluteFill}
        resizeMode={rest.resizeMode || 'cover'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface_light,
    overflow: 'hidden',
  },
});
