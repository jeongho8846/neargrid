import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppCollapsibleHeader from '../../common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '../../common/components/AppText';
import AppIcon from '../../common/components/AppIcon'; // ✅ 공용 아이콘 사용

const MapScreen = () => {
  const navigation = useNavigation();

  console.log('MapScreen rendered');
  return (
    <AppCollapsibleHeader
      titleKey="STR_MAP"
      showBack
      onBackPress={() => navigation.goBack()}
      right={
        <TouchableOpacity onPress={() => console.log('검색')}>
          <AppIcon type="ion" name="search" size={22} color="#333" />
        </TouchableOpacity>
      }
    >
      <View style={styles.content}>
        <AppText i18nKey="STR_MAP_CONTENT" style={styles.text} />
        <View style={styles.mockBlock}>
          <AppText i18nKey="STR_TEST_SCROLL_CONTENT" />
        </View>
      </View>
    </AppCollapsibleHeader>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16 },
  text: { fontSize: 20, fontWeight: '600' },
  mockBlock: {
    height: 10000,
    backgroundColor: '#eee',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
