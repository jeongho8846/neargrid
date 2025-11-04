// 📄 src/screens/member/SigninScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/common/components/AppText';
import AppInput from '@/common/components/Input';
import AppButton from '@/common/components/AppButton';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { useSignin } from '@/features/member/hooks/useSignin';
import { useNavigation } from '@react-navigation/native';
import { useKeyboardStore } from '@/common/state/keyboardStore';

type Props = {
  setIsAuth: (val: boolean) => void;
};

const SigninScreen: React.FC<Props> = ({ setIsAuth }) => {
  const { signin, loading } = useSignin();
  const { isVisible, height } = useKeyboardStore(); // 👈 전역 키보드 상태 구독

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const navigation = useNavigation();

  const translateY = useRef(new Animated.Value(0)).current;

  // ✅ 키보드 높이에 따라 화면 이동
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? -height / 2 : 0, // 💡 절반만 올리기 (너무 높으면 조정)
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible, height]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;

    const { success, member } = await signin(email.trim(), password.trim());
    if (success) {
      console.log('✅ [SigninScreen] 로그인 성공:', member);
      setIsAuth(true);
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('SignupScreen_checkEmail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <View style={styles.section}>
          <AppText
            i18nKey="STR_NEARGRID"
            variant="title"
            style={styles.title}
          />
          <AppInput
            ref={emailRef}
            placeholderKey="STR_EMAIL"
            onChangeText={setEmail}
            nextInputRef={passwordRef}
          />
          <AppInput
            ref={passwordRef}
            placeholderKey="STR_PASSWORD"
            secureTextEntry
            onChangeText={setPassword}
            returnKeyType="done"
          />
          <AppButton
            labelKey="STR_LOGIN"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
          />
          <TouchableOpacity
            style={styles.signupWrapper}
            onPress={handleSignupPress}
          >
            <AppText i18nKey="STR_SIGNUP" variant="link" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  section: {},
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  signupWrapper: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
});

export default SigninScreen;
