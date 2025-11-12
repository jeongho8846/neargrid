import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import PaymentHistoryItemCard from '../components/PaymentHistoryItemCard';
import type { PaymentHistory } from '../model/PaymentHistoryModel';
import { COLORS, SPACING } from '@/common/styles';

type Props = {
  data: PaymentHistory[];
  onLoadNext: () => void;
  loading?: boolean;
  hasNext?: boolean;
};

const PaymentHistoryList: React.FC<Props> = ({
  data,
  onLoadNext,
  loading,
  hasNext,
}) => {
  return (
    <AppFlatList
      data={data}
      keyExtractor={item => item.paymentId}
      renderItem={({ item }) => <PaymentHistoryItemCard item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 12 }}
      onEndReachedThreshold={0.2}
      onEndReached={() => {
        if (hasNext && !loading) onLoadNext();
      }}
      ListFooterComponent={
        loading ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={COLORS.brand} />
          </View>
        ) : null
      }
    />
  );
};

export default PaymentHistoryList;

const styles = StyleSheet.create({
  footer: {
    paddingVertical: SPACING.md,
  },
});
