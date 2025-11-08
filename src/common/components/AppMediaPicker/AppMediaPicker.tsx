import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '@/common/styles';
import AppText from '@/common/components/AppText';
import { useMediaPicker } from './hooks/useMediaPicker';
import CameraPickerButton from './CameraPickerButton';
import GalleryPickerButton from './GalleryPickerButton';
import { TEST_RADIUS } from '@/test/styles/radius';

export default function AppMediaPicker() {
  const { media, openCamera, openGallery, clearMedia } = useMediaPicker();

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <CameraPickerButton onPress={openCamera} />
        <GalleryPickerButton onPress={openGallery} />
      </View>

      {media.length > 0 && (
        <>
          <View style={styles.previewRow}>
            {media.map(item => (
              <Image
                key={item.uri}
                source={{ uri: item.uri }}
                style={styles.thumbnail}
              />
            ))}
          </View>

          <TouchableOpacity onPress={clearMedia} style={styles.clearButton}>
            <AppText i18nKey="STR_CLEAR_ALL" variant="danger" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.md },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: TEST_RADIUS.sm,
    backgroundColor: COLORS.sheet_background,
  },
  clearButton: {
    marginTop: SPACING.sm,
  },
});
