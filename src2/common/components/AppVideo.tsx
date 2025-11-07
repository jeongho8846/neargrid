// 📄 src/common/components/AppVideo.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import Video from 'react-native-video';
import AppIcon from './AppIcon';
import { COLORS, RADIUS } from '../styles/tokens';

type Props = {
  source: { uri: string };
  autoPlay?: boolean;
  loop?: boolean;
  style?: ViewStyle;
};

export default function AppVideo({
  source,
  autoPlay = false,
  loop = false,
  style,
}: Props) {
  const videoRef = useRef<Video>(null);
  const [paused, setPaused] = useState(!autoPlay);
  const [loading, setLoading] = useState(true);

  // ✅ autoPlay 변경 시 상태 동기화
  useEffect(() => {
    setPaused(!autoPlay);
  }, [autoPlay]);

  const togglePlay = () => setPaused(p => !p);

  return (
    <View style={[styles.touchArea, style]}>
      <TouchableWithoutFeedback onPress={togglePlay}>
        <View style={styles.container}>
          {/* 🎥 비디오 전체 터치 가능 */}
          <Video
            ref={videoRef}
            source={source}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            paused={paused}
            repeat={loop}
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
            pointerEvents="none"
          />

          {/* ⏳ 로딩 중 */}
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color={COLORS.surface_light} />
            </View>
          )}

          {/* ▶️ / ⏸️ 아이콘 — 비디오 전체 중앙에 */}
          {!loading && (
            <View style={styles.overlay}>
              <AppIcon
                name={paused ? 'play' : ''}
                size={64} // ✅ 크게 표시
                color={COLORS.surface_light}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.overlay_dark,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1111110a',
    width: '100%',
    height: '100%',
  },
});
