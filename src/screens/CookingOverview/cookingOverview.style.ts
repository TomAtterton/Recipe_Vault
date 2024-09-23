import { createStyleSheet } from 'react-native-unistyles';

export const styleSheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top,
  },
  contentContainer: {
    paddingBottom: miniRuntime.screen.height * 0.4,
  },
  instructionContainer: {
    width: miniRuntime.screen.width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
}));
