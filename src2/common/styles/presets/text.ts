import { TextStyle } from 'react-native';
import { FONT, COLORS } from '../tokens';

export const TEXT = {
  title: FONT.title,
  body: FONT.body,
  caption: FONT.caption,
  button: FONT.button,
  label: FONT.label,

  link: {
    ...FONT.body,
    color: COLORS.text_link,
  } as TextStyle,
} as const;
