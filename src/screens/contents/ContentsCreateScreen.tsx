// 📄 src/screens/contents/ContentsCreateScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
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
import { useKeyboardStore } from '@/common/state/keyboardStore';

export default function ContentsCreateScreen() {
  const [caption, setCaption] = useState('');
  const [inputHeight, setInputHeight] = useState(80); // ✅ 자동 확장용
  const navigation = useNavigation();
  const { member } = useCurrentMember();
  const { handleThreadSubmit, uploading } = useCreateThread();
  const { latitude, longitude, altitude } = useLocationStore();
  const { media, openCamera, openGallery, clearMedia, setMedia } =
    useMediaPicker();
  const scrollRef = useRef<ScrollView>(null);

  const { isVisible, height: keyboardHeight } = useKeyboardStore(); // 👈 전역 키보드 상태 구독

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

  useEffect(() => {
    if (isVisible) {
      // 약간의 delay를 주면 커서가 정확히 보임
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 120);
    }
  }, [isVisible, inputHeight]);

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
        ref={scrollRef}
        style={styles.scrollBody}
        contentContainerStyle={[
          styles.scrollContent,
          isVisible && { paddingBottom: keyboardHeight + 50 }, // ✅ 키보드가 올라오면 하단 패딩 증가
        ]}
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
          scrollEnabled={false}
          onContentSizeChange={e =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
          style={[styles.input, { height: Math.max(80, inputHeight) }]}
          placeholder="글을 입력하세요..."
          placeholderTextColor={COLORS.caption}
          onFocus={() => {
            // 포커스 시 자동으로 하단으로 스크롤
            setTimeout(
              () => scrollRef.current?.scrollToEnd({ animated: true }),
              100,
            );
          }}
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
