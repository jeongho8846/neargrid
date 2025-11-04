import React, { useEffect, useState, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import { apiMember } from '@/services/apiService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';

/**
 * ✅ SignupScreen_checkAuthNumber
 * - 회원가입 2단계: 이메일 인증번호 확인
 * - 키보드 반응 애니메이션 적용 (SigninScreen 구조 동일)
 */
const SignupScreen_checkAuthNumber = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const email = route.params?.email;
  const { isVisible, height } = useKeyboardStore(); // 👈 전역 키보드 상태

  const [code, setCode] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const codeRef = useRef<TextInput | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  // ✅ 화면 애니메이션 (키보드 반응)
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? -height / 2 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible, height]);

  // ✅ 첫 진입 시 인증번호 전송
  useEffect(() => {
    if (email) sendAuthCode();
  }, [email]);
  useEffect(() => {
    const timer = setTimeout(() => codeRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 카운트다운 관리
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const sendAuthCode = async () => {
    setResendDisabled(true);
    setCountdown(5);

    try {
      const formData = new FormData();
      formData.append('email', email);

      await apiMember.post('/emailVerify/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('✅ 인증번호 전송 성공');
    } catch (error) {
      console.error(
        '[SignupScreen_checkAuthNumber] 인증번호 전송 실패:',
        error,
      );
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('code', code);

      const response = await apiMember.post('/emailVerify/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        console.log('✅ 인증 성공:', response.data);
        setIsAuthError(false);
        navigation.navigate(
          'SignupScreen_password' as never,
          { email, code } as never,
        );
      }
    } catch (error) {
      console.error('[SignupScreen_checkAuthNumber] 인증 실패:', error);
      setIsAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  const CircleSteps = () => (
    <View style={styles.stepsContainer}>
      {[1, 2, 3, 4].map((num, index) => (
        <View
          key={num}
          style={[
            styles.circle,
            index === 1 && styles.activeCircle, // 현재 2단계
            index < 1 && styles.passedCircle, // 이전 단계 완료
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

            <AppText variant="body" style={styles.email}>
              {email}
            </AppText>

            <AppText
              i18nKey="STR_SIGNUP_CHECKAUTHNUMBER_GUIDE_1"
              variant="body"
              style={styles.guide}
            />

            {/* 🔢 인증번호 입력 */}
            <View style={styles.authRow}>
              <View style={styles.authRowLeft}>
                <AppInput
                  ref={codeRef}
                  placeholderKey="STR_AUTH_NUMBER"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setCode}
                  returnKeyType="done"
                />
              </View>
              <View style={styles.authRowRight}>
                <TouchableWithoutFeedback
                  onPress={resendDisabled ? undefined : sendAuthCode}
                >
                  <View
                    style={[
                      styles.resendBox,
                      resendDisabled && styles.resendDisabled,
                    ]}
                  >
                    <AppText variant="caption">
                      {resendDisabled
                        ? `${countdown}`
                        : t('STR_SIGNUP_BUTTON_RETRY_SEND')}
                    </AppText>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            {/* ⚠️ 에러 메시지 */}
            {isAuthError && (
              <AppText
                i18nKey="STR_ERROR_INVALID_AUTH_CODE"
                variant="caption"
                style={styles.errorText}
              />
            )}

            {/* ✅ 확인 버튼 */}
            <AppButton
              labelKey="STR_VERIFY"
              onPress={handleVerifyCode}
              loading={loading}
              disabled={code.length < 6}
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
    gap: SPACING.md,
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
  passedCircle: {
    backgroundColor: COLORS.button_disabled,
  },
  email: {
    textAlign: 'center',
  },
  guide: {
    textAlign: 'center',
  },
  authRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
    width: '100%',
    alignItems: 'center',
  },
  authRowLeft: { flex: 7 },
  authRowRight: { flex: 3 },
  resendBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 30,
  },
  resendDisabled: { opacity: 0.5 },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  button: { marginTop: SPACING.md },
  eulaWrapper: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
});

export default SignupScreen_checkAuthNumber;
