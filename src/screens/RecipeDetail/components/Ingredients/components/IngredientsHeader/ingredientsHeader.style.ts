import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  systemContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  systemButton: {
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 16,
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
