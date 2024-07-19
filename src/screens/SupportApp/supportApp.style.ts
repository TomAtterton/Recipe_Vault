import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 8,
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  name: {
    flex: 1,
  },

  thankYouText: {
    textAlign: 'center',
  },
  thankYouGif: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
}));
