// src/features/map/components/MapSearchBar.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  keyword: string;
  onClearKeyword: () => void;
};

const MapSearchBar: React.FC<Props> = ({ keyword, onClearKeyword }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.searchBar}>
      <TouchableOpacity
        style={styles.searchArea}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('MapSearch')}
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
    position: 'absolute',
    top: 10,
    left: 50,
    right: SPACING.sm,
    height: 42,
    backgroundColor: COLORS.sheet_background,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchText: {
    marginLeft: 8,
    flexShrink: 1,
  },
  clearButton: {
    padding: 4,
    marginLeft: 6,
  },
});
