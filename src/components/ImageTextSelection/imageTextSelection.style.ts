import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((_, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 60,
  },
  contentContainer: {
    flex: 1,
  },
}));
