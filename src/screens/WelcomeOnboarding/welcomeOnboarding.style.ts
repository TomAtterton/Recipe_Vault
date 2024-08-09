import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    paddingTop: miniRuntime.insets.top + 40,
    paddingBottom: miniRuntime.insets.bottom,
    flex: 1,
    marginHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    textAlign: 'center',
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
    alignSelf: 'flex-start',
  },
  input: {
    marginTop: 40,
  },
}));
