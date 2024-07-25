import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    gap: 20,
  },
  scrollContent: {
    flex: 1,
    flexGrow: 1,
    marginTop: 40,
    gap: 20,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));
