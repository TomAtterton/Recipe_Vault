import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: miniRuntime.insets.bottom,
  },
  title: {
    textAlign: 'center',
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 16,
  },
  button: {
    flex: 0,
    marginVertical: 20,
  },
}));
