import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: 40,
    gap: 8,
    alignItems: 'center',
    borderRadius: theme.borderRadius,
  },
  title: {
    flex: 0.5,
    color: theme.colors.typography,
  },
  rightContent: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonTitle: {
    color: theme.colors.primary,
  },
}));
