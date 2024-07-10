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
}));
