import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingLeft: 8,
    paddingRight: 16,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    paddingLeft: 8,
  },
  description: {
    flex: 1,
    paddingTop: 4,
    paddingLeft: 8,
    color: theme.colors.placeholder,
  },
}));
