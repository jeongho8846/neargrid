import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import AppText from './AppText';
import { COLORS, SPACING } from '../styles/tokens';
import { LAYOUT } from '../styles/presets';

type TabItem = { key: string; tKey: string };
type Props = {
  tabs: TabItem[];
  onChange: (key: string) => void;
  initialKey?: string;
};

const { width } = Dimensions.get('window');

export default function AppTabs({ tabs, onChange, initialKey }: Props) {
  const [active, setActive] = useState(initialKey || tabs[0]?.key);
  const indicator = useRef(new Animated.Value(0)).current;
  const tabWidth = width / tabs.length;
  const initialized = useRef(false);

  const handlePress = (key: string, index: number) => {
    setActive(key);
    onChange(key);

    Animated.spring(indicator, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      bounciness: 6,
      speed: 12,
    }).start();
  };

  // ✅ 첫 렌더에서만 indicator 위치 초기화
  useEffect(() => {
    if (!initialized.current) {
      const initialIndex = tabs.findIndex(t => t.key === active);
      indicator.setValue(initialIndex * tabWidth);
      initialized.current = true;
    }
  }, [tabs, active, tabWidth, indicator]);

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => handlePress(tab.key, index)}
          style={styles.tab}
        >
          <AppText
            tKey={tab.tKey}
            variant="label"
            style={{
              color:
                active === tab.key ? COLORS.primary : COLORS.text_secondary,
            }}
          />
        </TouchableOpacity>
      ))}

      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            transform: [{ translateX: indicator }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...LAYOUT.rowBetween,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border_light,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: COLORS.primary,
  },
});
