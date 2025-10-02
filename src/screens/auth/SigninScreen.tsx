import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiMember } from '../../services/apiService';

const SigninScreen = ({ setIsAuth }: { setIsAuth: (val: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = async () => {
    try {
      console.log('🔄 로그인 API 호출:', { email, password });

      const res = await apiMember.post('/member/signIn', { email, password });

      const {
        accessToken,
        refreshToken,
        member_id,
        nickName,
        profileImageUrl,
      } = res.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem(
        'user_info',
        JSON.stringify({ member_id, nickName, profileImageUrl }),
      );

      console.log('✅ 로그인 성공, Root → Main 이동');

      // RootNavigator 상태 변경 → MainTabNavigator로 전환
      setIsAuth(true);
    } catch (err: any) {
      if (err?.response) {
        console.log('❌ API 실패:', err.response.status, err.response.data);
      } else {
        console.log('❌ 네트워크 오류:', err?.message ?? err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디(이메일)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="로그인" onPress={handleSignin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});

export default SigninScreen;
