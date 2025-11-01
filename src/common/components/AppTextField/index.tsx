// 📄 src/common/components/AppTextField.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import AppText from '../AppText';
import { COLORS } from '@/common/styles/colors';

type Props = {
  text: string;
  numberOfLines?: number;
  isLoading?: boolean;
};

const AppTextField: React.FC<Props> = ({
  text,
  numberOfLines = 3,
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const showMoreButton = text.length > 60;

  return (
    <View style={styles.container}>
      <Skeleton
        isLoading={isLoading}
        hasFadeIn
        duration={1200}
        animationType="pulse"
        boneColor={COLORS.skeleton_bone_light}
        highlightColor={COLORS.skeleton_highlight_light}
        containerStyle={styles.skeletonContainer}
        layout={[
          {
            key: 'l1',
            width: '95%',
            height: 16,
            borderRadius: 6,
            marginBottom: 8,
          },
          {
            key: 'l2',
            width: '90%',
            height: 16,
            borderRadius: 6,
            marginBottom: 8,
          },
          { key: 'l3', width: '80%', height: 16, borderRadius: 6 },
        ]}
      >
        {/* ✅ 실제 텍스트 콘텐츠 */}
        <AppText
          variant="body"
          numberOfLines={expanded ? undefined : numberOfLines}
        >
          {text}
        </AppText>

        {/* ✅ 더보기 / 접기 버튼 */}
        {showMoreButton && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <AppText
              variant="link" // ✅ 액션성 있는 텍스트이므로 link variant 사용
              i18nKey={expanded ? 'STR_COLLAPSE' : 'STR_MORE'}
            />
          </TouchableOpacity>
        )}
      </Skeleton>
    </View>
  );
};

export default AppTextField;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  skeletonContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
