import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
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
