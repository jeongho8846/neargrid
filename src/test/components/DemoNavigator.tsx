import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_SPACING } from '@/test/styles/spacing';
import { FONT } from '@/test/styles/FONT';
import { useBottomSheetStore } from '../common/state/bottomSheetStore';

type TabName = 'map' | 'feed' | 'create' | 'alarm' | 'profile';

const DemoNavigator: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isVisible } = useBottomSheetStore();

  const tabs: { key: TabName; label: string; icon: string; route: string }[] = [
    { key: 'map', label: 'Map', icon: 'map-outline', route: 'DemoMap' },
    { key: 'feed', label: 'Feed', icon: 'home-outline', route: 'DemoFeed' },
    { key: 'create', label: 'Create', icon: 'add', route: 'DemoCreate' }, // ✅ 중앙 버튼
    {
      key: 'alarm',
      label: 'Alarm',
      icon: 'notifications-outline',
      route: 'DemoAlarm',
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: 'person-outline',
      route: 'DemoProfile',
    },
  ];

  const currentRoute = navigation.getState()?.routes?.slice(-1)[0]?.name;
  const active = tabs.find(tab => tab.route === currentRoute)?.key;

  // ✅ 애니메이션 스타일 (보이기/숨기기)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible ? 1 : 0, { duration: 250 }),
    transform: [
      { translateY: withTiming(isVisible ? 0 : 50, { duration: 250 }) },
    ],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View style={styles.container}>
        {tabs.map(tab => {
          const focused = active === tab.key;
          const isCenter = tab.key === 'create';
          const color = focused
            ? TEST_COLORS.primary
            : TEST_COLORS.text_secondary;

          if (isCenter) {
            // ✅ 중앙 Create 버튼 (둥근 Primary)
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => navigation.navigate(tab.route)}
                activeOpacity={0.8}
                style={styles.centerButtonWrapper}
              >
                <View style={styles.centerButton}>
                  <Ionicons name={tab.icon} size={26} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(tab.route)}
            >
              <Ionicons name={tab.icon} size={22} color={color} />
              <Text
                style={[
                  styles.label,
                  focused && { color: TEST_COLORS.primary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default DemoNavigator;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24,24,24,0.85)', // ✅ 반투명 다크
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    ...FONT.caption,
    color: TEST_COLORS.text_secondary,
    marginTop: TEST_SPACING.xs / 2,
    fontSize: 10,
  },
  centerButtonWrapper: {
    position: 'relative',
    top: 0, // 중앙 버튼 살짝 띄워도 됨 (ex. -15)
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: TEST_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
