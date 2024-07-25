import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 16,
    width: {
      md: '50%',
      lg: '33.33%',
      xl: '33.33%',
    },
    height: {
      md: '50%',
      lg: '100%',
      xl: '100%',
    },
  },
  contentContainerStyle: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingBottom: 10,
    paddingTop: 20,
    color: theme.colors.onBackground80,
  },
}));
