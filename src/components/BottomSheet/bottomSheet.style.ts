import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
  bottomSheetContainer: {
    paddingTop: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: 16,
  },
}));
