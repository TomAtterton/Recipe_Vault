import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    marginTop: 40,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  shimmerItem: {
    marginBottom: 20,
  },
  shimmerImage: {
    borderRadius: 10,
  },
  shimmerText: {
    marginTop: 10,
    borderRadius: 10,
  },
}));
