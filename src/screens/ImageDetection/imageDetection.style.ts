import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 80,
    paddingBottom: miniRuntime.insets.bottom,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 20,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: miniRuntime.insets.top + 20,
    left: 20,
  },
}));
