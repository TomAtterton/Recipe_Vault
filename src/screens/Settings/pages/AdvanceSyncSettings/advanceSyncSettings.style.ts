import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 16,
  },
});