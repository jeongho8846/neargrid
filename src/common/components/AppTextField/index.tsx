import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../AppText';

type Props = {
  text: string;
  /** 기본 표시 줄 수 */
  numberOfLines?: number;
};

const AppTextField: React.FC<Props> = ({ text, numberOfLines = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <AppText
        variant="body" // ✅ 전역 variant 사용
        numberOfLines={expanded ? undefined : numberOfLines}
      >
        {text}
      </AppText>

      {text.length > 60 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          {expanded ? (
            <AppText
              variant="body"
              color="text_secondary"
              i18nKey="STR_COLLAPSE"
            />
          ) : (
            <AppText variant="body" color="text_secondary" i18nKey="STR_MORE" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppTextField;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
