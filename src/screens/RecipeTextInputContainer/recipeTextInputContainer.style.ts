import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: miniRuntime.insets.top,
    paddingBottom: miniRuntime.insets.bottom,
  },
  input: {
    flex: 1,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 8,
  },
  imageZoomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: theme.colors.background,
  },
  close: {
    position: 'absolute',
    top: miniRuntime.insets.top + 20,
    right: 0,
  },
}));
