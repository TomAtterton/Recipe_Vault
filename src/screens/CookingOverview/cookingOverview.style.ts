import { createStyleSheet } from 'react-native-unistyles';

export const styleSheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 60,
  },
  contentContainer: {
    paddingBottom: miniRuntime.screen.height * 0.4,
  },
  instructionScrollContainer: {
    flexGrow: 1,
  },
  instructionContainer: {
    flex: 1,
    width: miniRuntime.screen.width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
}));
