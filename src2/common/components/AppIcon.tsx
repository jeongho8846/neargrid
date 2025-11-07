import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/tokens';

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export default function AppIcon({
  name,
  size = 20,
  color = COLORS.text_primary,
}: Props) {
  return <Icon name={name} size={size} color={color} />;
}
