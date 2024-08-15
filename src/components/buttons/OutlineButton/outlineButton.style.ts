import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {},
  contentContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    paddingRight: 8,
  },
  text: {
    color: theme.colors.primary,
  },
  loading: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
