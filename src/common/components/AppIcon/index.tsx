import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle } from 'react-native';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  type?: 'ion' | 'material'; // 확장 가능
  style?: TextStyle;
};

export default function AppIcon({
  name,
  size = 24,
  color = '#333',
  type = 'ion',
  style,
}: IconProps) {
  switch (type) {
    case 'material':
      return (
        <MaterialIcons name={name} size={size} color={color} style={style} />
      );
    case 'ion':
    default:
      return <Ionicons name={name} size={size} color={color} style={style} />;
  }
}
