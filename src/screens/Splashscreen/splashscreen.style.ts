import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    color: theme.colors.placeholder,
    textAlign: 'center',
    overflow: 'visible',
  },
  activityIndicator: {
    paddingTop: 40,
    paddingBottom: 20,
  },
}));
