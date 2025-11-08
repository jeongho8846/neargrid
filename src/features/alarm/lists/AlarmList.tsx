import React from 'react';
import { View, StyleSheet } from 'react-native';

import AlarmItem from '../components/AlarmItem';
import type { AlarmModel } from '../model/AlarmModel';
import AppFlatList from 'src2/common/components/AppFlatList';
import { SPACING } from '@/common/styles';

type Props = {
  data: AlarmModel[];
};

export default function AlarmList({ data }: Props) {
  return (
    <View style={styles.container}>
      <AppFlatList
        data={data}
        keyExtractor={item => item.alarmId}
        renderItem={({ item }) => <AlarmItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: SPACING.sm,
  },
});
