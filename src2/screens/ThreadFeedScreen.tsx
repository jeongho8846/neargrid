import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader, { HEADER_HEIGHT } from '@/common/components/AppHeader';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList';
import AppReadMoreBox from '@/common/components/AppReadMoreBox';
import { LAYOUT } from '@/common/styles/presets/layout';

export default function ThreadFeedScreen() {
  const sampleText = '이건\n\n줄바꿈\n테스트야';

  return (
    <View style={styles.root}>
      <AppHeader
        tKey="screen.feed.title"
        rightIcon="notifications-outline"
        showBackButton={true}
      />

      <AppFlatList
        headerAutoHide
        tabBarAutoHide
        data={[...Array(10).keys()]}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 12 }}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <AppText tKey="screen.feed.item" values={{ index: item }} />
            <AppReadMoreBox numberOfLines={3}>{sampleText}</AppReadMoreBox>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...LAYOUT.screen,
  },
  item: {
    padding: 12,
    height: 300,
  },
});
