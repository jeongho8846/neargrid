import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

const AppMapSearchHereButton = ({ onPress, isLoading }: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <AppIcon name="refresh" type="ion" variant="onDark" size={18} />
        <AppText
          i18nKey="STR_MAP_SEARCH_HERE"
          variant="button"
          style={styles.text}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AppMapSearchHereButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SPACING.xl * 1.5,
    alignSelf: 'center',
    backgroundColor: COLORS.button_surface,
    borderRadius: 24,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: SPACING.xs,
  },
});
