import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  creditText: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  specialThanks: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
}));
