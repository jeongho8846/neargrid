import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';

type Props = {
  /** 프로필 이미지 URL */
  imageUrl?: string | null;
  /** 프로필로 이동 가능 여부 */
  canGoToProfileScreen?: boolean;
  /** 프로필 이동 시 필요한 ID */
  memberId?: string;
  /** 프로필 이미지 크기 (px) */
  size?: number;
};

/**
 * ✅ 안전한 네비게이션 훅 호출 (NavigationContext 외부일 경우 null 반환)
 */
function useSafeNavigation(): NavigationProp<any> | null {
  try {
    return useNavigation<NavigationProp<any>>();
  } catch {
    return null;
  }
}

const AppProfileImage: React.FC<Props> = ({
  imageUrl,
  canGoToProfileScreen = false,
  memberId,
  size = 40,
}) => {
  const navigation = useSafeNavigation();

  const handlePress = () => {
    if (!canGoToProfileScreen || !memberId || !navigation) return;
    navigation.push('Profile', { memberId });
  };

  const hasImage = !!imageUrl;
  const Wrapper = canGoToProfileScreen ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      activeOpacity={0.8}
      onPress={handlePress as any}
    >
      {hasImage ? (
        <FastImage
          source={{ uri: imageUrl! }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: COLORS.background,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View
          style={[
            styles.iconContainer,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <AppIcon
            type="ion"
            name="person-circle-outline"
            size={size}
            color={COLORS.text}
          />
        </View>
      )}
    </Wrapper>
  );
};

export default AppProfileImage;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.emty_imageBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
