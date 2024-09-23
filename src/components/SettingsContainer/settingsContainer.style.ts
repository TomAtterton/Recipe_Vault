import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    gap: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
});
