import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppText from '@/common/components/AppText';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useFetchPaymentHistory } from '@/features/payment/hooks/useFetchPaymentHistory';
import PaymentHistoryList from '@/features/payment/lists/PaymentHistoryList';
import { COLORS } from '@/common/styles';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { useNavigation } from '@react-navigation/native';

const PaymentHistoryScreen = () => {
  const navigation = useNavigation();
  const { member } = useCurrentMember();
  const { data, loading, error, loadNext, hasNext } = useFetchPaymentHistory(
    member?.id ?? '',
  );

  if (loading && data.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.body} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText variant="danger" i18nKey="STR_ERROR_FETCH_PAYMENT_HISTORY" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <AppText i18nKey="STR_PAYMENT_HISTORY_EMPTY" variant="body" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_SEARCH"
        isAtTop={true}
        onBackPress={() => navigation.goBack()}
      />
      <PaymentHistoryList
        data={data}
        onLoadNext={loadNext}
        loading={loading}
        hasNext={hasNext}
      />
    </View>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingTop: 70,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
