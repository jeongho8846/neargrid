import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/common/components/AppText';
import AppInput from '@/common/components/Input';
import AppButton from '@/common/components/AppButton';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { apiMember } from '@/services/apiService';
import { useNavigation } from '@react-navigation/native';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';

/**
 * ✅ SignupScreen_checkEmail
 * - 회원가입 1단계: 이메일 중복 확인
 * - 키보드 반응 애니메이션 (SigninScreen과 동일)
 */
const SignupScreen_checkEmail = () => {
  const navigation = useNavigation();
  const { isVisible, height } = useKeyboardStore(); // 👈 전역 키보드 상태
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const emailRef = useRef<TextInput | null>(null);

  const translateY = useRef(new Animated.Value(0)).current;

  // ✅ 첫 진입 시 이메일 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => emailRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 키보드 열릴 때 화면 이동 (SigninScreen 동일 구조)
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? -height / 2 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible, height]);

  const handleSubmit = async () => {
    if (!email.trim()) return;

    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (!emailRegex.test(email)) {
      setIsEmailValid(false);
      return;
    }

    setIsEmailValid(true);
    setIsChecking(true);

    console.log('이메일', email);
    try {
      const res = await apiMember.get('/member/signUp/checkDuplicateEmail', {
        params: { email },
      });

      if (res.data.exists) {
        setIsEmailDuplicate(true);
      } else {
        setIsEmailDuplicate(false);
        navigation.navigate(
          'SignupScreen_checkAuthNumber' as never,
          { email } as never,
        );
      }
    } catch (error) {
      console.error('[SignupScreen_checkEmail] 이메일 확인 실패:', error);
      setIsEmailDuplicate(true);
    } finally {
      setIsChecking(false);
    }
  };

  const CircleSteps = () => (
    <View style={styles.stepsContainer}>
      {[1, 2, 3, 4].map((num, index) => (
        <View
          key={num}
          style={[
            styles.circle,
            index === 0 && styles.activeCircle, // 현재 1단계
          ]}
        >
          <AppText variant="caption">{num}</AppText>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppCollapsibleHeader
        titleKey="SRT_SIGNUP"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />

      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <CircleSteps />

            <AppText
              i18nKey="STR_SIGNUP_CHECKEMAIL_GUIDE_1"
              variant="body"
              style={styles.guide}
            />

            {/* ✉️ 이메일 입력 */}
            <AppInput
              ref={emailRef}
              placeholderKey="STR_EMAIL"
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* ⚠️ 에러 메시지 */}
            {!isEmailValid && (
              <AppText
                i18nKey="STR_ERROR_INVALID_EMAIL"
                variant="caption"
                style={styles.errorText}
              />
            )}
            {isEmailDuplicate && (
              <AppText
                i18nKey="STR_ERROR_DUPLICATE_EMAIL"
                variant="caption"
                style={styles.errorText}
              />
            )}

            {/* 🚀 다음 버튼 */}
            <AppButton
              labelKey="STR_NEXT"
              onPress={handleSubmit}
              loading={isChecking}
              disabled={!email.trim()}
              style={styles.button}
            />

            {/* 📜 약관 */}
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('EULA' as never)}
            >
              <View style={styles.eulaWrapper}>
                <AppText
                  i18nKey="STR_ACCOUNT_MAINMENU_EULA"
                  variant="caption"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  inner: {
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  activeCircle: {
    backgroundColor: COLORS.button_active,
  },
  guide: {
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  button: {},
  eulaWrapper: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
});

export default SignupScreen_checkEmail;
