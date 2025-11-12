import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import MemberStatsRow from './MemberStatsRow';
import { MemberProfile } from '../model/MemberProfileModel';
import AppImageCarousel from '@/common/components/AppImageCarousel';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppTextField from '@/common/components/AppTextField'; // ✅ 추가
import FastImage from '@d11/react-native-fast-image';
import AppButton from '@/common/components/AppButton';
import { useOpenPrivateChatRoom } from '@/features/chat/hooks/useOpenPrivateChatRoom';

const { width } = Dimensions.get('window');

type Props = {
  currentMemberId?: string;
  profile?: MemberProfile;
  isLoading?: boolean;
};

/**
 * ✅ MemberProfileHeader
 * - Top: 커버 이미지
 * - Middle: 이름 + 프로필 이미지 + 설명(AppTextField)
 * - Bottom: 포인트 + 통계
 */
const MemberProfileHeader: React.FC<Props> = ({
  currentMemberId,
  profile,
  isLoading,
}) => {
  const coverImage = profile?.backgroundUrl;
  const profileImage = profile?.profileImageUrl;
  const { openPrivateChat } = useOpenPrivateChatRoom();

  console.log(
    '프로필프로필프로필프로필프로필프로필프로필프로필프로필프로필프로필프로필',
    profile,
  );
  return (
    <View style={styles.container}>
      {/* 🔹 Top - Cover */}
      <View style={styles.coverContainer}>
        {coverImage ? (
          <FastImage
            source={{ uri: coverImage }}
            style={styles.coverImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[styles.coverImage, styles.coverPlaceholder]} />
        )}
      </View>

      {/* 🔹 Middle - 이름 / 설명 / 프로필 */}
      <View style={styles.middleSection}>
        <View style={styles.nameArea}>
          <AppText variant="username" isLoading={isLoading}>
            {profile?.realName ?? ''}
          </AppText>

          {/* ✅ description 영역 - AppTextField 사용 */}
          <View style={{ marginTop: SPACING.xs }}>
            {profile?.description ? (
              <AppTextField
                text={profile.description}
                numberOfLines={3}
                isLoading={isLoading}
              />
            ) : (
              !isLoading && (
                <AppText variant="body" style={styles.emptyDesc}>
                  소개글이 없습니다.
                </AppText>
              )
            )}
          </View>
        </View>

        <View style={styles.profileImageBox}>
          <AppProfileImage
            imageUrl={profileImage}
            size={100}
            canGoToProfileScreen={false}
            memberId={profile?.id}
          />
        </View>
      </View>
      <View style={styles.middleSection_foot}>
        <AppButton
          labelKey="STR_FOLLOWINGS"
          onPress={() => {
            if (profile?.id) {
              openPrivateChat(profile.id);
            }
          }}
        />
        <AppButton
          labelKey="STR_CHAT_SEND_MESSAGE"
          onPress={() => {
            if (profile?.id) {
              openPrivateChat(profile.id);
            }
          }}
        />
      </View>

      {/* 🔹 Bottom - 포인트 + 통계 */}
      <View style={styles.bottomSection}>
        <MemberStatsRow
          stats={profile?.stats}
          isLoading={isLoading}
          targetId={profile?.id}
          receivedPoint={profile?.receivedPoint}
          givenPoint={profile?.givenPoint}
        />
      </View>
    </View>
  );
};

export default MemberProfileHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.lg,
  },

  /** ──────── TOP ──────── **/
  coverContainer: {
    width,
    height: width * 1,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    backgroundColor: COLORS.background,
  },

  /** ──────── MIDDLE ──────── **/
  middleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  middleSection_foot: {
    width: '100%',
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignContent: 'space-between',
    gap: 5,
  },
  nameArea: {
    flex: 1,
  },
  emptyDesc: {
    color: COLORS.gray4,
    marginTop: 4,
  },
  profileImageBox: {
    bottom: 50,
  },

  /** ──────── BOTTOM ──────── **/
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray3,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
});
