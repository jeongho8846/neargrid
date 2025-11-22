import React from 'react';
import { View, StyleSheet } from 'react-native';
import AlarmItem from '../components/AlarmItem';
import type { AlarmModel } from '../model/AlarmModel';
import { SPACING } from '@/common/styles';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';

type Props = {
  data: AlarmModel[];
  onItemPress?: (alarm: AlarmModel) => void;
};

export default function AlarmList({ data, onItemPress }: Props) {
  return (
    <View style={styles.container}>
      <AppFlatList
        data={data}
        keyExtractor={item => item.alarmId}
        renderItem={({ item }) => (
          <AlarmItem item={item} onPress={onItemPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
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
