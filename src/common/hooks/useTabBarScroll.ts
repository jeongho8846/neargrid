import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export const useTabBarScroll = (tabBarHeight = 80) => {
  const visible = useSharedValue(true);

  const hideTabBar = () => {
    'worklet';
    visible.value = false;
  };

  const showTabBar = () => {
    'worklet';
    visible.value = true;
  };

  const tabBarStyle = useAnimatedStyle(() => {
    const translateY = withSpring(visible.value ? 0 : tabBarHeight, {
      damping: 200,
      stiffness: 150,
    });
    return { transform: [{ translateY }] };
  });

  return { tabBarStyle, hideTabBar, showTabBar, visible };
};
