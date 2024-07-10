import { createStyleSheet } from 'react-native-unistyles';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

const SIZE = 32;
export const SIZE_MARGIN = SIZE + 8;
export const stylesheet = createStyleSheet(() => ({
  container: {
    height: SIZE,
    transform: [{ translateX: SCREEN_WIDTH / 2 - 20 - (SIZE_MARGIN * 5) / 2 }],
  },
}));
