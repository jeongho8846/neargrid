import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppButton from '@/common/components/AppButton';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

/**
 * ✅ DemoCreateScreen
 * - 게시글 작성 화면 (뒤로가기 + 하단 아이콘/버튼 구성)
 */
const DemoCreateScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    console.log('📝 [Create] 작성 완료:', text);
  };

  return (
    <View style={styles.root}>
      {/* 🔹 Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppIcon name="arrow-back" type="ion" variant="primary" />
        </TouchableOpacity>
        <AppText variant="title">Create</AppText>
        <View style={{ width: 28 }} /> {/* 오른쪽 균형용 더미 */}
      </View>

      {/* 🔹 Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 + 입력 영역 */}
        <View style={styles.row}>
          <AppProfileImage size={40} />
          <TextInput
            style={styles.input}
            placeholder="무슨 일이 일어나고 있나요?"
            placeholderTextColor={TEST_COLORS.text_secondary}
            multiline
            value={text}
            onChangeText={setText}
          />
        </View>

        {/* 이미지 placeholder */}
        <View style={styles.imagePlaceholder}>
          <AppText variant="caption">📸 이미지 업로드 예정</AppText>
        </View>
      </ScrollView>

      {/* 🔹 Footer (사진첩 + 카메라 + 게시 버튼) */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.footerIcon}>
            <AppIcon
              name="image-outline"
              type="ion"
              variant="primary"
              size={26}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <AppIcon
              name="camera-outline"
              type="ion"
              variant="primary"
              size={26}
            />
          </TouchableOpacity>

          {/* 오른쪽 끝에 버튼 */}
          <View style={{ flex: 1 }} />
          <AppButton label="게시하기" onPress={handleSubmit} />
        </View>
      </View>
    </View>
  );
};

export default DemoCreateScreen;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEST_COLORS.background,
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TEST_SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: TEST_SPACING.md,
  },
  input: {
    flex: 1,
    marginLeft: TEST_SPACING.sm,
    color: TEST_COLORS.text_primary,
    fontSize: 16,
    paddingVertical: TEST_SPACING.sm,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    borderRadius: TEST_RADIUS.md,
    backgroundColor: TEST_COLORS.surface_light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: TEST_SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: TEST_SPACING.md,
  },
});
