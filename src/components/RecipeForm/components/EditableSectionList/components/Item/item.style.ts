import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
  },
  button: {
    height: 30,
    width: 30,
  },
});
