import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  inputContainer: {
    minHeight: 48,
    backgroundColor: theme.colors.lightBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.onBackground,
  },
  icon: {
    position: 'absolute',
    right: -16,
  },
  error: {
    paddingTop: 8,
    color: theme.colors.error,
  },
}));
