import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppInput from '@/common/components/Input';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useCreateThread } from '@/features/thread/hooks/useCreateThread';
import { useLocationStore } from '@/features/location/state/locationStore';
import { COLORS, SPACING } from '@/common/styles';

export default function ContentsCreateScreen() {
  const [caption, setCaption] = useState('');
  const navigation = useNavigation();
  const { member } = useCurrentMember();
  const { handleThreadSubmit, uploading } = useCreateThread();

  // ✅ 전역 위치 상태 (이미 다른 곳에서 setLocation 되어 있다고 가정)
  const { latitude, longitude, altitude } = useLocationStore();

  const handleSubmit = async () => {
    console.log('📤 게시 버튼 클릭');

    if (!caption.trim()) {
      console.log('⚠️ 내용이 비어있습니다.');
      return;
    }

    // ✅ 위치값 로그로 확인
    console.log('📍 저장된 위치값:', { latitude, longitude, altitude });

    if (!latitude || !longitude) {
      console.warn('🚫 위치 정보가 없습니다. 스토어를 확인하세요.');
      return;
    }

    // ✅ 업로드 요청
    handleThreadSubmit({
      currentMember: member,
      description: caption,
      threadType: 'GENERAL_THREAD',
      bounty_point: '0',
      remain_in_minute: '0',
      region: null,
      images: [],
      navigation,
      latitude,
      longitude,
      altitude,
    });
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
        <View style={styles.profileRow}>
          <AppProfileImage size={40} source={{ uri: member?.profileImage }} />
          <AppText variant="username" style={styles.nickname}>
            {member?.nickname ?? 'Guest'}
          </AppText>
        </View>

        <AppInput
          placeholderKey="STR_CONTENTS_CREATE_CAPTION_PLACEHOLDER"
          multiline
          value={caption}
          onChangeText={setCaption}
          style={[
            styles.input,
            {
              backgroundColor: COLORS.background,
              height: 350,
            },
          ]}
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
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: SPACING.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nickname: {
    marginLeft: SPACING.sm,
  },
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
});
