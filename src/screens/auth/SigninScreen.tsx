import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiMember } from '../../services/apiService';
import AppText from '../../common/components/AppText';
import AppInput from '../../common/components/Input';
import AppButton from '../../common/components/AppButton';
import { TextInput } from 'react-native';

const SigninScreen = ({ setIsAuth }: { setIsAuth: (val: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const handleSignin = async () => {
    try {
      setLoading(true);
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
      setIsAuth(true);
    } catch (err: any) {
      if (err?.response) {
        console.log('❌ API 실패:', err.response.status, err.response.data);
      } else {
        console.log('❌ 네트워크 오류:', err?.message ?? err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ 공용 AppText */}
      <AppText i18nKey="STR_LOGIN" variant="title" style={styles.title} />

      {/* ✅ 공용 AppInput */}
      <AppInput
        ref={emailRef}
        labelKey="STR_EMAIL"
        placeholderKey="STR_EMAIL"
        onChangeText={setEmail}
        nextInputRef={passwordRef} // ✅ 정상 동작
      />

      <AppInput
        ref={passwordRef}
        labelKey="STR_PASSWORD"
        placeholderKey="STR_PASSWORD"
        secureTextEntry
        onChangeText={setPassword}
        returnKeyType="done" // 마지막 인풋은 "완료"
      />

      {/* ✅ 공용 AppButton */}
      <AppButton
        labelKey="STR_LOGIN"
        onPress={handleSignin}
        loading={loading}
        style={{ width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 12 }, // 높이/룩앤필은 AppInput이 보장
});

export default SigninScreen;
