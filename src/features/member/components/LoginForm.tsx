import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AppInput from '@/common/components/Input';
import AppButton from '@/common/components/AppButton';

type Props = {
  loading: boolean;
  onSubmit: (email: string, password: string) => void;
};

const LoginForm = ({ loading, onSubmit }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const handlePress = () => {
    if (!email || !password) return;
    onSubmit(email, password);
  };

  return (
    <View style={styles.form}>
      <AppInput
        ref={emailRef}
        labelKey="STR_EMAIL"
        placeholderKey="STR_EMAIL"
        onChangeText={setEmail}
        nextInputRef={passwordRef}
      />
      <AppInput
        ref={passwordRef}
        labelKey="STR_PASSWORD"
        placeholderKey="STR_PASSWORD"
        secureTextEntry
        onChangeText={setPassword}
        returnKeyType="done"
      />
      <AppButton
        labelKey="STR_LOGIN"
        onPress={handlePress}
        loading={loading}
        style={{ width: '100%', marginTop: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: { width: '100%' },
});

export default LoginForm;
