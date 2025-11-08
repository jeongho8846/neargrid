// 📄 src/screens/contents/ContentsCreateScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppInput from '@/common/components/Input';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

import { COLORS, SPACING } from '@/common/styles';

export default function ContentsCreateScreen() {
  const [caption, setCaption] = useState('');

  // ✅ 현재 로그인 유저 정보 가져오기
  const { member } = useCurrentMember();

  // ✅ 나중에 API 연결 예정
  const handleSubmit = () => {
    if (!caption.trim()) {
      console.log('⚠️ 내용이 비어있습니다.');
      return;
    }
    console.log('✅ 게시하기 클릭:', caption);
    // 👉 추후 useCreateContents() 호출 예정
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* 🧩 Header */}
      <AppCollapsibleHeader
        titleKey="STR_CONTENTS_CREATE_TITLE"
        isAtTop={false}
        right={
          <TouchableOpacity onPress={handleSubmit} style={styles.postButton}>
            <AppText i18nKey="STR_CONTENTS_CREATE_SUBMIT" variant="link" />
          </TouchableOpacity>
        }
      />

      {/* 🧩 본문 (스크롤 가능) */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 👤 프로필 영역 */}
        <View style={styles.profileRow}>
          <AppProfileImage size={40} source={{ uri: member?.profileImage }} />
          <AppText variant="username" style={styles.nickname}>
            {member?.nickname ?? 'Guest'}
          </AppText>
        </View>

        {/* ✏️ 텍스트 입력 */}
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
