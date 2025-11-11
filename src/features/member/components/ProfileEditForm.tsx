import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppInput from '@/common/components/Input';
import { useMediaPicker } from '@/common/components/AppMediaPicker/hooks/useMediaPicker';
import {
  useUploadProfileImage,
  useUploadCoverImage,
  useUpdateNickName,
  useUpdateRealName,
  useUpdateProfileText,
} from '../hooks/useUpdateMemberProfile';
import { COLORS, SPACING } from '@/common/styles';
import { MemberProfile } from '../model/MemberProfileModel';
import AppImage from '@/common/components/AppImage';
import AppButton from '@/common/components/AppButton';

type Props = {
  profile: MemberProfile;
};

export default function ProfileEditForm({ profile }: Props) {
  const memberId = profile.id;

  /** 이미지 업로드 훅 */
  const { mutate: uploadProfileImage, isPending: profileUploading } =
    useUploadProfileImage(memberId);
  const { mutate: uploadCoverImage, isPending: coverUploading } =
    useUploadCoverImage(memberId);

  /** 텍스트 수정 훅 */
  const { mutate: updateNickName, isPending: nickSaving } =
    useUpdateNickName(memberId);
  const { mutate: updateRealName, isPending: realSaving } =
    useUpdateRealName(memberId);
  const { mutate: updateProfileText, isPending: bioSaving } =
    useUpdateProfileText(memberId);

  /** 입력 상태 */
  const [nickname, setNickname] = useState(profile.nickName ?? '');
  const [realname, setRealname] = useState(profile.realName ?? '');
  const [bio, setBio] = useState(profile.profileText ?? '');

  /** 미디어 선택 */
  const { openPicker } = useMediaPicker();

  const handlePickProfile = async () => {
    const assets = await openPicker({ mediaType: 'photo', selectionLimit: 1 });
    if (assets && assets.length > 0) {
      const image = assets[0];
      uploadProfileImage({
        uri: image.uri,
        mime: image.type ?? 'image/jpeg',
        filename: image.fileName ?? 'profile.jpg',
      });
    }
  };

  const handlePickCover = async () => {
    const assets = await openPicker({ mediaType: 'photo', selectionLimit: 1 });
    if (assets && assets.length > 0) {
      const image = assets[0];
      uploadCoverImage({
        uri: image.uri,
        mime: image.type ?? 'image/jpeg',
        filename: image.fileName ?? 'cover.jpg',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ 커버 이미지 */}
      <TouchableOpacity style={styles.coverContainer} onPress={handlePickCover}>
        <AppImage
          source={{ uri: profile.coverImageUrl }}
          style={styles.coverImage}
        />
        {coverUploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={COLORS.white} />
          </View>
        )}
      </TouchableOpacity>

      {/* ✅ 프로필 이미지 */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handlePickProfile}>
          <AppProfileImage imageUrl={profile.profileImageUrl} size={84} />
          {profileUploading && (
            <View style={styles.loadingOverlaySmall}>
              <ActivityIndicator color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ✅ 닉네임 */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldColumn}>
          <AppText i18nKey="STR_NICKNAME" variant="caption" />
          <AppInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter your nickname"
            editable={!nickSaving}
          />
        </View>
        <AppButton
          titleKey="STR_SAVE"
          size="sm"
          onPress={() => nickname && updateNickName(nickname)}
          disabled={nickSaving}
          style={styles.saveButton}
        />
      </View>

      {/* ✅ 실명 */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldColumn}>
          <AppText i18nKey="STR_REALNAME" variant="caption" />
          <AppInput
            value={realname}
            onChangeText={setRealname}
            placeholder="Enter your real name"
            editable={!realSaving}
          />
        </View>
        <AppButton
          titleKey="STR_SAVE"
          size="sm"
          onPress={() => realname && updateRealName(realname)}
          disabled={realSaving}
          style={styles.saveButton}
        />
      </View>

      {/* ✅ 자기소개 */}
      <View style={styles.fieldColumn}>
        <AppText i18nKey="STR_INTRODUCTION" variant="caption" />
        <AppInput
          value={bio}
          onChangeText={setBio}
          placeholder="Write your introduction"
          editable={!bioSaving}
          multiline
          style={styles.textArea}
        />
        <AppButton
          titleKey="STR_SAVE"
          size="sm"
          onPress={() => bio && updateProfileText(bio)}
          disabled={bioSaving}
          style={[styles.saveButton, { alignSelf: 'flex-end' }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  coverContainer: {
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlaySmall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  fieldColumn: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: SPACING.sm,
  },
  saveButton: {
    height: 36,
    alignSelf: 'center',
  },
});
