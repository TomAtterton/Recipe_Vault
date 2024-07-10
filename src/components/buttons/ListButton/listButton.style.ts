import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    borderRadius: theme.borderRadius,
  },
  icon: {
    paddingRight: 8,
  },
  text: {
    color: theme.colors.typography,
  },
}));
