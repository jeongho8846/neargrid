// src/features/map/components/MapSearchBar.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  keyword: string;
  onPress: () => void;
  onClearKeyword: () => void;
};

const MapSearchBar: React.FC<Props> = ({
  keyword,
  onPress,
  onClearKeyword,
}) => {
  return (
    <View style={styles.searchBar}>
      <TouchableOpacity
        style={styles.searchArea}
        activeOpacity={0.5}
        onPress={onPress}
      >
        <AppIcon name="search" type="ion" size={18} variant="secondary" />
        <AppText variant="body" style={styles.searchText}>
          {keyword || '검색어를 입력하세요'}
        </AppText>
      </TouchableOpacity>

      {keyword.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClearKeyword}
          activeOpacity={0.7}
        >
          <AppIcon
            name="close-circle"
            type="ion"
            size={20}
            variant="secondary"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapSearchBar;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.sheet_background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  searchText: {
    flex: 1,
  },
  clearButton: {
    padding: SPACING.xs,
  },
});
