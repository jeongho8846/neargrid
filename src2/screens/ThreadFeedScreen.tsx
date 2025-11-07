import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader, { HEADER_HEIGHT } from '@/common/components/AppHeader';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList';
import { LAYOUT } from '@/common/styles/presets/layout';

export default function ThreadFeedScreen() {
  return (
    <View style={styles.root}>
      <AppHeader
        tKey="screen.feed.title"
        rightIcon="notifications-outline"
        showBackButton={false}
      />

      <AppFlatList
        headerAutoHide
        tabBarAutoHide
        data={[...Array(30).keys()]}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 12 }}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => (
          <View style={{ height: 200 }}>
            <AppText tKey="screen.feed.item" values={{ index: item }} />
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
});
