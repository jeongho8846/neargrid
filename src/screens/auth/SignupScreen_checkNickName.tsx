import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
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
 * ✅ SignupScreen_checkNickName
 * - 회원가입 4단계: 닉네임 설정 및 가입 완료
 * - 키보드 반응 애니메이션 적용 (SigninScreen 구조 동일)
 */
const SignupScreen_checkNickName = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { email, password, code } = route.params || {};
  const { isVisible, height } = useKeyboardStore(); // 👈 전역 키보드 상태

  const [nickName, setNickName] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isRegexError, setIsRegexError] = useState(false);
  const [loading, setLoading] = useState(false);
  const nickRef = useRef<TextInput | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  // ✅ 키보드 높이에 따라 화면 이동
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? -height / 2 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible, height]);

  // ✅ 닉네임 입력 포커스
  useEffect(() => {
    const timer = setTimeout(() => nickRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 닉네임 정규식 (소문자, 숫자, _, . 만 허용)
  const nicknameRegex = /^[a-z0-9_.]+$/;

  const handleChangeNickName = (text: string) => {
    setNickName(text);
    setIsDuplicate(false);
    setIsRegexError(!nicknameRegex.test(text) && text.trim().length > 0);
  };

  // ✅ 닉네임 중복 확인 및 회원가입
  const handleSubmit = async () => {
    if (!nickName.trim() || isRegexError) return;
    setLoading(true);

    try {
      const res = await apiMember.get('/member/signUp/checkDuplicateNickName', {
        params: { nickName },
      });

      if (res.data.exists) {
        setIsDuplicate(true);
        setLoading(false);
        return;
      }

      // ✅ 회원가입 요청
      const signupRes = await apiMember.post('/member/signUp', {
        nickName,
        email,
        password,
        emailVerificationCode: code,
      });

      console.log('✅ 회원가입 성공:', signupRes.data);
      navigation.navigate('SigninScreen' as never);
    } catch (error) {
      console.error('[SignupScreen_checkNickName] 회원가입 오류:', error);
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
            index === 3 && styles.activeCircle, // 현재 4단계
            index < 3 && styles.passedCircle, // 이전 단계 완료
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
              i18nKey="STR_SIGNUP_CHECKNICKNAME_GUIDE_1"
              variant="body"
              style={styles.guide}
            />

            {/* ✏️ 닉네임 입력 */}
            <AppInput
              ref={nickRef}
              placeholderKey="STR_NICKNAME"
              maxLength={30}
              autoCapitalize="none" // ✅ 자동 대문자 방지
              onChangeText={text => {
                const lower = text.toLowerCase(); // ✅ 강제 소문자 변환
                handleChangeNickName(lower);
              }}
              value={nickName}
              returnKeyType="done"
            />

            {/* 🔢 글자 수 */}
            <AppText variant="caption" style={styles.charCount}>
              {nickName.length}/30
            </AppText>

            {/* ⚠️ 에러 메시지 */}
            {isDuplicate && (
              <AppText
                i18nKey="STR_ERROR_DUPLICATE_NICKNAME"
                variant="caption"
                style={styles.errorText}
              />
            )}
            {isRegexError && (
              <>
                <AppText
                  i18nKey="STR_ERROR_NICKNAME_REGEX_GUIDE"
                  variant="caption"
                  style={styles.errorText}
                />
                <AppText
                  i18nKey="STR_ERROR_NICKNAME_REGEX_GUIDE_EXAMPLE"
                  variant="caption"
                  style={styles.errorText}
                />
              </>
            )}

            {/* 🚀 가입 완료 버튼 */}
            <AppButton
              labelKey="STR_COMPLETE"
              onPress={handleSubmit}
              loading={loading}
              disabled={!nickName.trim() || isRegexError}
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
  guide: {
    textAlign: 'center',
  },
  charCount: {
    textAlign: 'right',
    marginRight: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.md,
  },
  eulaWrapper: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
});

export default SignupScreen_checkNickName;
