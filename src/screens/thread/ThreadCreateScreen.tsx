// 📄 src/screens/BlankScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText'; // ✅ 프로젝트 규칙에 맞게 AppText 사용
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { useNavigation } from '@react-navigation/native';

const ThreadCreateScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_FEED"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />
      <AppText variant="title">Blank Screen</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default ThreadCreateScreen;
