import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },

  title: {
    textAlign: 'center',
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 16,
  },
  scrollview: {
    flex: 1,
    marginBottom: 20,
  },
  scrollviewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  button: {
    flex: 0,
    marginBottom: 20,
  },
}));
