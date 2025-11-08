import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { Asset } from 'react-native-image-picker';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppInput from '@/common/components/Input';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppIcon from '@/common/components/AppIcon';
import CameraPickerButton from '@/common/components/AppMediaPicker/CameraPickerButton';
import GalleryPickerButton from '@/common/components/AppMediaPicker/GalleryPickerButton';
import { useMediaPicker } from '@/common/components/AppMediaPicker/hooks/useMediaPicker';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useCreateThread } from '@/features/thread/hooks/useCreateThread';
import { useLocationStore } from '@/features/location/state/locationStore';
import { COLORS, SPACING } from '@/common/styles';
import { TEST_RADIUS } from '@/test/styles/radius';

export default function ContentsCreateScreen() {
  const [caption, setCaption] = React.useState('');
  const navigation = useNavigation();
  const { member } = useCurrentMember();
  const { handleThreadSubmit, uploading } = useCreateThread();
  const { latitude, longitude, altitude } = useLocationStore();

  // ✅ media 상태를 직접 사용
  const { media, openCamera, openGallery, clearMedia, setMedia } =
    useMediaPicker();

  const handleSubmit = async () => {
    console.log('📤 게시 버튼 클릭');

    if (!caption.trim() && media.length === 0) {
      console.log('⚠️ 내용과 사진이 모두 비어있습니다.');
      return;
    }
    if (!latitude || !longitude)
      return console.warn('🚫 위치 정보가 없습니다.');

    handleThreadSubmit({
      currentMember: member,
      description: caption,
      threadType: 'GENERAL_THREAD',
      bounty_point: '0',
      remain_in_minute: '0',
      region: null,
      images: media, // ✅ Asset 배열 그대로
      navigation,
      latitude,
      longitude,
      altitude,
    });
  };

  const handleRemoveItem = (uri?: string) => {
    if (!uri) return;
    setMedia(prev => prev.filter(m => m.uri !== uri));
  };

  return (
    <SafeAreaView style={styles.root}>
      <AppCollapsibleHeader
        titleKey="STR_CONTENTS_CREATE_TITLE"
        isAtTop={false}
        right={
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.postButton}
            disabled={uploading}
          >
            <AppText i18nKey="STR_CONTENTS_CREATE_SUBMIT" variant="link" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🧩 프로필 영역 */}
        <View style={styles.profileRow}>
          <AppProfileImage size={40} source={{ uri: member?.profileImage }} />
          <AppText variant="username" style={styles.nickname}>
            {member?.nickname ?? 'Guest'}
          </AppText>
        </View>

        {/* 🧩 사진/카메라 버튼 구역 */}
        <View style={styles.mediaRow}>
          <CameraPickerButton onPress={openCamera} />
          <GalleryPickerButton onPress={openGallery} />
        </View>

        {/* 🧩 가로 스크롤 미리보기 */}
        {media.length > 0 && (
          <View style={styles.previewSection}>
            <FlatList
              horizontal
              data={media}
              keyExtractor={item => item.uri ?? Math.random().toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.previewList}
              renderItem={({ item }) => (
                <View style={styles.thumbnailWrapper}>
                  <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.uri)}
                  >
                    <AppIcon name="close" size={16} variant="onDark" />
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity onPress={clearMedia} style={styles.clearButton}>
              <AppText i18nKey="STR_CLEAR_ALL" variant="danger" />
            </TouchableOpacity>
          </View>
        )}

        {/* 🧩 텍스트 입력 */}
        <AppInput
          placeholderKey="STR_CONTENTS_CREATE_CAPTION_PLACEHOLDER"
          multiline
          value={caption}
          onChangeText={setCaption}
          style={[styles.input, { backgroundColor: COLORS.background }]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
  },
  scrollBody: { flex: 1 },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: SPACING.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nickname: { marginLeft: SPACING.sm },
  mediaRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  previewSection: {
    marginBottom: SPACING.lg,
  },
  previewList: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: TEST_RADIUS.sm,
    backgroundColor: COLORS.sheet_background,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 2,
  },
  clearButton: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
  },
  input: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  postButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
});
