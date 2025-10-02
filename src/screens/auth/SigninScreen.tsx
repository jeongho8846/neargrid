import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { useSignin } from '@/features/member/hooks/useSignin';
import LoginForm from '@/features/member/components/LoginForm';

type Props = {
  setIsAuth: (val: boolean) => void;
};

const SigninScreen = ({ setIsAuth }: Props) => {
  const { signin, loading } = useSignin();

  const handleSubmit = async (email: string, password: string) => {
    const { success, member } = await signin(email, password);
    if (success) {
      console.log('✅ 로그인 성공:', member);
      setIsAuth(true);
    }
  };

  return (
    <View style={styles.container}>
      <AppText i18nKey="STR_LOGIN" variant="title" style={styles.title} />
      <LoginForm loading={loading} onSubmit={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { marginBottom: 24, textAlign: 'center' },
});

export default SigninScreen;
