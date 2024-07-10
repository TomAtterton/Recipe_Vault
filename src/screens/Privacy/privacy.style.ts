import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
  },
  scrollView: {
    flex: 1,
    paddingTop: runtime.insets.top + 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: runtime.insets.top + 40,
  },

  backButton: {
    position: 'absolute',
    top: runtime.insets.top,
    left: 0,
  },
}));
