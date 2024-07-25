import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    // flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    width: {
      lg: '33.33%',
      xl: '33.33%',
    },
    height: {
      md: '50%',
      lg: '50%',
      xl: '100%',
    },
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 64,
  },
  sectionHeader: {
    paddingTop: 20,
    color: theme.colors.onBackground80,
  },
  stepContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 20,
  },
  stepTitle: {
    color: theme.colors.primary,
  },
  stepText: {
    flex: 1,
  },
}));
