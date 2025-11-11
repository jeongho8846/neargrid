// 📄 src/screens/member/ProfileEditScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppText from '@/common/components/AppText';
import ProfileEditForm from '@/features/member/components/ProfileEditForm';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { COLORS, SPACING } from '@/common/styles';
import { AppSkeletonPreset } from '@/common/components/Skeletons';
import { useFetchMemberProfile } from '@/features/member/hooks/useFetchMemberProfile';

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { member: currentMember } = useCurrentMember();
  const route = useRoute();
  const targetUserId = route?.params?.memberId ?? currentMember?.id;

  /** 👤 프로필 데이터 */
  const { data: profile, isLoading } = useFetchMemberProfile(
    currentMember?.id ?? '',
    targetUserId ?? '',
    { enabled: !!targetUserId },
  );

  return (
    <View style={styles.container}>
      {/* ✅ 고정 헤더 */}
      <AppCollapsibleHeader
        titleKey="STR_PROFILE_EDIT"
        onBackPress={() => navigation.goBack()}
      />

      {/* ✅ 로딩 상태 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <AppSkeletonPreset type="profile" />
        </View>
      )}

      {/* ✅ ScrollView로 변경 */}
      {!isLoading && profile ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ProfileEditForm profile={profile} />
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
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
