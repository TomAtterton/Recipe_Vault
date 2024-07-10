import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginHorizontal: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  icon: {
    paddingRight: 8,
  },
  text: {
    flex: 1,
    paddingLeft: 8,
    color: theme.colors.primary,
  },
}));
