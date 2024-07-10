import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  containerContent: {
    backgroundColor: theme.colors.placeholder,
    overflow: 'hidden',
  },
  containerShimmer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
}));
