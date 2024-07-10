import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  servingsText: {
    color: theme.colors.primary,
    marginVertical: 8,
    paddingLeft: 8,
  },
}));
