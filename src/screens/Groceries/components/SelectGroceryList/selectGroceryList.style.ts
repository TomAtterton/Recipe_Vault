import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    gap: 20,
    paddingVertical: 20,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
}));
