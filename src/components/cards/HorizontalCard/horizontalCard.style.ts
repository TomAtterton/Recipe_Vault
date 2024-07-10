import { createStyleSheet } from 'react-native-unistyles';

const IMAGE_SIZE = 150;

export const IMAGE_HEIGHT = IMAGE_SIZE;
export const IMAGE_WIDTH = IMAGE_SIZE;

const TEXT_CONTAINER_HEIGHT = IMAGE_HEIGHT / 2;

export const CONTAINER_WIDTH = IMAGE_WIDTH;
export const CONTAINER_HEIGHT = IMAGE_HEIGHT + TEXT_CONTAINER_HEIGHT;

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
  },
  textContainer: {
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 8,
    height: TEXT_CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  },
  title: {
    height: TEXT_CONTAINER_HEIGHT / 1.5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cookTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTitle: {
    color: theme.colors.primary,
    marginLeft: 8,
  },
}));
