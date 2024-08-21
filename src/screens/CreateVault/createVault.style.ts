import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    paddingTop: miniRuntime.insets.top + 40,
    paddingBottom: miniRuntime.insets.bottom,
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  subtitle: {
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  button: {
    width: miniRuntime.screen.width / 1.5,
    height: 50,
  },
  backButton: {
    position: 'absolute',
    top: miniRuntime.insets.top,
    left: 0,
  },
  input: {
    marginTop: 40,
  },
}));
