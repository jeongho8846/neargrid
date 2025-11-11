// 📄 src/screens/member/ProfileEditScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  findNodeHandle,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import ProfileEditForm from '@/features/member/components/ProfileEditForm';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { COLORS, SPACING } from '@/common/styles';
import { AppSkeletonPreset } from '@/common/components/Skeletons';
import { useFetchMemberProfile } from '@/features/member/hooks/useFetchMemberProfile';
import { useKeyboardStore } from '@/common/state/keyboardStore';

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { member: currentMember } = useCurrentMember();
  const route = useRoute();
  const scrollRef = useRef<ScrollView>(null);

  const { isVisible, height: keyboardHeight } = useKeyboardStore();

  const targetUserId = route?.params?.memberId ?? currentMember?.id;

  const { data: profile, isLoading } = useFetchMemberProfile(
    currentMember?.id ?? '',
    targetUserId ?? '',
    { enabled: !!targetUserId },
  );

  // ✅ 포커스된 인풋 위치로 스크롤
  const handleFocusScroll = (inputRef: React.RefObject<any>) => {
    if (!scrollRef.current || !inputRef.current) return;

    const windowHeight = Dimensions.get('window').height;

    inputRef.current.measureLayout(
      findNodeHandle(scrollRef.current),
      (x, y, width, height) => {
        // 중앙 근처로 이동: y - (화면의 절반 - 입력 필드 높이의 절반)
        const targetY = Math.max(0, y - windowHeight / 2 + height / 2);
        scrollRef.current?.scrollTo({ y: targetY, animated: true });
      },
      () => {},
    );
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
    }
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_PROFILE_EDIT"
        onBackPress={() => navigation.goBack()}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <AppSkeletonPreset type="profile" />
        </View>
      )}

      {!isLoading && profile ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.scrollContent,
            isVisible && { paddingBottom: keyboardHeight + 50 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ✅ 콜백 전달 */}
          <ProfileEditForm profile={profile} onInputFocus={handleFocusScroll} />
        </ScrollView>
      ) : (
        !isLoading && (
          <View style={styles.emptyContainer}>
            <AppText i18nKey="STR_NO_DATA" variant="body" />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
});
