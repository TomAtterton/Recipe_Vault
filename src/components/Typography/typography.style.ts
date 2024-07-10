import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.colors.typography,
  },
}));
