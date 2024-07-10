import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    borderRadius: 10,
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    gap: 32,
    backgroundColor: theme.colors.lightBackground,
  },
  title: {
    textAlign: 'center',
  },
}));
