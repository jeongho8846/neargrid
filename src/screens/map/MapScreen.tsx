import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapScreen = () => {
  console.log('MapScreen rendered');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🗺️ Map Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default MapScreen;
