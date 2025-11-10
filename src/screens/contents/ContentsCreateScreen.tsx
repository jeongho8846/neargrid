// 📄 src/screens/contents/ContentsCreateScreen.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Asset } from 'react-native-image-picker';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
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
import AppInput from '@/common/components/Input';

export default function ContentsCreateScreen() {
  const [caption, setCaption] = useState('');
  const [inputHeight, setInputHeight] = useState(80); // ✅ 자동 확장용
  const navigation = useNavigation();
  const { member } = useCurrentMember();
  const { handleThreadSubmit, uploading } = useCreateThread();
  const { latitude, longitude, altitude } = useLocationStore();
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
      images: media,
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
    <View style={styles.root}>
      {/* 상단 고정 헤더 */}
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

      {/* 전체 스크롤 영역 */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 🧩 프로필 영역 */}
        <View style={styles.profileRow}>
          <AppProfileImage
            size={40}
            source={{ uri: member?.profileImageUrl }}
          />
          <AppText variant="username" style={styles.nickname}>
            {member?.nickname ?? 'Guest'}
          </AppText>
        </View>

        {/* 🧩 미디어 선택 */}
        <View style={styles.mediaRow}>
          <CameraPickerButton onPress={openCamera} />
          <GalleryPickerButton onPress={openGallery} />
        </View>

        {/* 🧩 선택된 미디어 미리보기 */}
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
          scrollEnabled={false} // ✅ 내부 스크롤 비활성화 → 부모 ScrollView 담당
          onContentSizeChange={e =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
          style={[styles.input, { height: Math.max(80, inputHeight) }]}
          placeholder="글을 입력하세요..."
          placeholderTextColor={COLORS.caption}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 120,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
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
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  postButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
});
