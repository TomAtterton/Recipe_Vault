import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    paddingVertical: 20,
    marginBottom: 20,
  },
  carousel: {},
  carouselContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingTop: 64,
    paddingBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
}));
