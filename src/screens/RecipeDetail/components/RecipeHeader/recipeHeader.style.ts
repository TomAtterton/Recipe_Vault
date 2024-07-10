import { HEIGHT } from '@/theme/constants';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { createStyleSheet } from 'react-native-unistyles';

export const IMAGE_HEIGHT = HEIGHT / 2.8;
export const IMAGE_WIDTH = SCREEN_WIDTH;

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  topNavigation: {
    position: 'absolute',
    right: 16,
    left: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  description: {
    marginTop: 16,
  },
  calendar: { position: 'absolute', bottom: 0, right: 0 },

  bottomContainer: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  cookedButton: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  ratingContainer: {
    paddingTop: 16,
  },
  starRating: {},
  revert: {
    position: 'absolute',
    top: 8,
    right: 16,
  },
}));
