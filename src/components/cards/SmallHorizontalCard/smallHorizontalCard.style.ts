import { createStyleSheet } from 'react-native-unistyles';

const IMAGE_SIZE = 100;

export const stylesheet = createStyleSheet(() => ({
  item: {
    height: IMAGE_SIZE * 2,
    maxWidth: IMAGE_SIZE,
  },
  itemContent: {
    paddingBottom: 16,
    maxWidth: IMAGE_SIZE,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    marginBottom: 4,
  },
  metaContainer: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTitle: {
    paddingLeft: 4,
  },
}));
