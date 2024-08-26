import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
  navButton: {
    alignSelf: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  shimmer: {
    borderRadius: 10,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  blurView: {
    paddingVertical: 8,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    marginVertical: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
}));
