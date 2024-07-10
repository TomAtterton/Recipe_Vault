import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingTop: 20,
    gap: 20,
    flexGrow: 1,
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
});
