import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  menuView: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
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
