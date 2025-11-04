import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';

/**
 * ✅ SignupScreen_password
 * - 회원가입 3단계: 비밀번호 설정
 * - useKeyboardStore 기반 키보드 반응 애니메이션 적용
 */
const SignupScreen_password = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { email, code } = route.params || {};
  const { isVisible, height } = useKeyboardStore(); // 👈 전역 키보드 상태

  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [isVisiblePw, setIsVisiblePw] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isMatched, setIsMatched] = useState(true);

  const passwordRef = useRef<TextInput | null>(null);
  const checkPasswordRef = useRef<TextInput | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => passwordRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 키보드 높이에 따라 부드럽게 이동
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? -height / 2 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible, height]);

  // ✅ 비밀번호 정규식
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const handleNext = () => {
    if (!passwordRegex.test(password)) {
      setIsPasswordValid(false);
      return;
    }
    if (password !== checkPassword) {
      setIsMatched(false);
      return;
    }

    navigation.navigate(
      'SignupScreen_checkNickName' as never,
      { email, password, code } as never,
    );
  };

  const CircleSteps = () => (
    <View style={styles.stepsContainer}>
      {[1, 2, 3, 4].map((num, index) => (
        <View
          key={num}
          style={[
            styles.circle,
            index === 2 && styles.activeCircle, // 현재 3단계
            index < 2 && styles.passedCircle, // 이전 단계 완료
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
              i18nKey="STR_SIGNUP_CHECKPASSWORD_GUIDE_1"
              variant="body"
              style={styles.guide}
            />

            {/* 🔑 비밀번호 입력 */}
            <AppInput
              ref={passwordRef}
              placeholderKey="STR_PASSWORD"
              secureTextEntry={!isVisiblePw}
              onChangeText={text => {
                setPassword(text);
                setIsPasswordValid(true);
                setIsMatched(true);
              }}
              nextInputRef={checkPasswordRef}
              returnKeyType="next"
            />

            {/* 🔑 비밀번호 확인 */}
            <AppInput
              ref={checkPasswordRef}
              placeholderKey="STR_PASSWORD_CONFIRM"
              secureTextEntry={!isVisiblePw}
              onChangeText={text => {
                setCheckPassword(text);
                setIsMatched(true);
              }}
              returnKeyType="done"
            />

            {/* 👁️ 비밀번호 보기/숨기기 토글 */}
            <TouchableOpacity
              style={styles.toggleWrapper}
              onPress={() => setIsVisiblePw(prev => !prev)}
            >
              <AppText variant="caption">
                {isVisiblePw ? t('STR_PASSWORD_HIDE') : t('STR_PASSWORD_SHOW')}
              </AppText>
            </TouchableOpacity>

            {/* ⚠️ 에러 메시지 */}
            {!isPasswordValid && (
              <AppText
                i18nKey="STR_ERROR_INVALID_PASSWORD"
                variant="caption"
                style={styles.errorText}
              />
            )}
            {!isMatched && (
              <AppText
                i18nKey="STR_ERROR_PASSWORD_MISMATCH"
                variant="caption"
                style={styles.errorText}
              />
            )}

            {/* 🚀 다음 단계 버튼 */}
            <AppButton
              labelKey="STR_NEXT"
              onPress={handleNext}
              disabled={!password || !checkPassword}
              style={styles.button}
            />

            {/* 📜 약관 */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.eulaWrapper}
              onPress={() => navigation.navigate('EULA' as never)}
            >
              <AppText i18nKey="STR_ACCOUNT_MAINMENU_EULA" variant="caption" />
            </TouchableOpacity>
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
  guide: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  toggleWrapper: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.lg,
  },
  eulaWrapper: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
});

export default SignupScreen_password;
