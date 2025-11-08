import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS } from '../styles/tokens';
import AppIcon from './AppIcon';
import AppImage from './AppImage';

type Props = {
  uri?: string | null;
  targetMemberId?: string;
  enablePress?: boolean;
  style?: any;
  onPress?: (e: GestureResponderEvent) => void;
};

export default function AppAvatar({
  uri,
  targetMemberId,
  enablePress = false,
  style,
  onPress,
}: Props) {
  const navigation = useNavigation<any>();

  const handlePress = (e: GestureResponderEvent) => {
    if (onPress) {
      onPress(e);
      return;
    }
    if (enablePress && targetMemberId) {
      navigation.navigate('memberProfile', { memberId: targetMemberId });
    }
  };

  const Wrapper = enablePress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.container, style]}
      onPress={enablePress ? handlePress : undefined}
      activeOpacity={0.8}
    >
      {uri ? (
        <AppImage source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <AppIcon
            name="person-sharp"
            size={24}
            color={COLORS.text_secondary}
          />
        </View>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: RADIUS.round,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
