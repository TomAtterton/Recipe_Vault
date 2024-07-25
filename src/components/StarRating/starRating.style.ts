import { createStyleSheet } from 'react-native-unistyles';

const SIZE = 32;
export const SIZE_MARGIN = SIZE + 8;
export const stylesheet = createStyleSheet(() => ({
  container: {
    height: SIZE,
  },
}));
