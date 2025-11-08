import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '@/common/components/AppHeader';
import { LAYOUT } from '@/common/styles/presets/layout';
import ThreadList from '@/features/thread/lists/ThreadList';

export default function ThreadFeedScreen() {
  return (
    <View style={styles.root}>
      <AppHeader tKey="screen.feed.title" />
      <ThreadList />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...LAYOUT.screen,
  },
});
