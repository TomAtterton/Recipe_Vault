import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  imageBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
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
