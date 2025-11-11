import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppInput from '@/common/components/Input';
import {
  useUploadProfileImage,
  useUploadCoverImage,
  useUpdateNickName,
  useUpdateRealName,
  useUpdateProfileText,
} from '../hooks/useUpdateMemberProfile';
import { COLORS, SPACING } from '@/common/styles';
import { Member } from '../types';
import FastImage from '@d11/react-native-fast-image';
import AppButton from '@/common/components/AppButton';
import GalleryPickerButton from '@/common/components/AppMediaPicker/GalleryPickerButton';
import { useMediaPicker } from '@/common/components/AppMediaPicker/hooks/useMediaPicker';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';

const { width } = Dimensions.get('window');

type Props = {
  profile: Member;
  /** ✅ 포커스된 인풋으로 스크롤 이동용 콜백 (ProfileEditScreen에서 전달) */
  onInputFocus?: (inputRef: React.RefObject<TextInput>) => void;
};

export default function ProfileEditForm({ profile, onInputFocus }: Props) {
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
  const [nickname, setNickname] = useState(profile.nickname ?? '');
  const [realname, setRealname] = useState(profile.realName ?? '');
  const [bio, setBio] = useState(profile.description ?? '');

  /** ✅ 미디어 선택 훅 */
  const { openCamera, openGallery } = useMediaPicker();

  /** ✅ 인풋 ref */
  const nicknameRef = useRef<TextInput>(null);
  const realnameRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  console.log('프로필!!!!!!!!!!!!', profile);
  return (
    <View style={styles.container}>
      {/* ✅ 커버 이미지 */}
      <View style={styles.coverBlock}>
        <TouchableOpacity style={styles.coverContainer} onPress={openGallery}>
          <FastImage
            source={{ uri: profile.backgroundUrl }}
            style={styles.coverImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {coverUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>

        {/* 갤러리 버튼 */}
        <View style={styles.coverImagePickerRow}>
          <GalleryPickerButton onPress={openGallery} />
        </View>
        <View style={styles.avatarBlock}>
          <TouchableOpacity onPress={openGallery}>
            <View style={styles.avatarContainer}>
              <AppProfileImage imageUrl={profile.profileImageUrl} size={84} />
              {profileUploading && (
                <View style={styles.loadingOverlaySmall}>
                  <ActivityIndicator color={COLORS.body} />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* 갤러리 버튼 */}
          <View style={styles.profileImagePickerRow}>
            <GalleryPickerButton onPress={openGallery} />
          </View>
        </View>
      </View>

      {/* ✅ 프로필 이미지 */}

      {/* ✅ 닉네임 */}
      <View style={styles.body}>
        <View style={styles.fieldRow}>
          <View style={styles.fieldColumn}>
            <AppText i18nKey="STR_NICKNAME" variant="body" />
            <AppInput
              ref={nicknameRef}
              value={nickname}
              onChangeText={setNickname}
              placeholder="Enter your nickname"
              editable={!nickSaving}
              onFocus={() => onInputFocus?.(nicknameRef)} // ✅ 포커스 시 스크롤 이동
            />
          </View>
          <AppButton
            labelKey="STR_SAVE"
            onPress={() => nickname && updateNickName(nickname)}
            disabled={nickSaving}
            style={styles.saveButton}
          />
        </View>

        {/* ✅ 실명 */}
        <View style={styles.fieldRow}>
          <View style={styles.fieldColumn}>
            <AppText i18nKey="STR_REALNAME" variant="body" />
            <AppInput
              ref={realnameRef}
              value={realname}
              onChangeText={setRealname}
              placeholder="Enter your real name"
              editable={!realSaving}
              onFocus={() => onInputFocus?.(realnameRef)} // ✅ 포커스 시 스크롤 이동
            />
          </View>
          <AppButton
            labelKey="STR_SAVE"
            onPress={() => realname && updateRealName(realname)}
            disabled={realSaving}
            style={styles.saveButton}
          />
        </View>

        {/* ✅ 자기소개 */}
        <View style={styles.fieldColumn_introduction}>
          <AppText i18nKey="STR_INTRODUCTION" variant="body" />
          <AppInput
            ref={bioRef}
            value={bio}
            onChangeText={setBio}
            placeholder="Write your introduction"
            editable={!bioSaving}
            multiline
            style={styles.textArea}
            onFocus={() => onInputFocus?.(bioRef)} // ✅ 포커스 시 스크롤 이동
          />
          <AppButton
            labelKey="STR_SAVE"
            onPress={() => bio && updateProfileText(bio)}
            disabled={bioSaving}
            style={[styles.saveButton, { alignSelf: 'flex-end' }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  coverBlock: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  coverContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    position: 'absolute',
    right: 10,
    bottom: -50,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
  },
  coverImagePickerRow: {
    backgroundColor: COLORS.overlay_strong,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  profileImagePickerRow: {
    backgroundColor: COLORS.overlay_strong,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    position: 'absolute',
    bottom: 0,
    left: 0,
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

  body: { paddingHorizontal: SPACING.sm },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    alignContent: 'center',
  },
  fieldColumn: {
    flex: 1,
    marginRight: SPACING.sm,
    gap: 10,
  },
  fieldColumn_introduction: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: SPACING.sm,
  },
  saveButton: {
    height: 36,
    top: 5,
    alignSelf: 'center',
  },
});
