import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  seeAllButton: {
    position: 'absolute',
    right: {
      xs: 8,
      sm: 8,
      md: 20,
      lg: 20,
    },
    bottom: 8,
  },
  seeAllText: {
    color: 'orange',
  },
});
