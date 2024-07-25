import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    paddingHorizontal: 20,
    paddingTop: {
      xs: 0,
      sm: 0,
      md: 10,
      lg: 10,
      xl: 10,
    },
    width: {
      xs: miniRuntime.screen.width,
      sm: miniRuntime.screen.width,
      md: miniRuntime.screen.width / 2,
      lg: miniRuntime.screen.width / 3,
      xl: miniRuntime.screen.width / 3,
    },
    height: {
      xs: miniRuntime.screen.height / 4 + miniRuntime.screen.height / 2.8,
      md: '50%',
      lg: '50%',
      xl: '50%',
    },
  },
  image: {
    borderRadius: 20,
    height: {
      xs: miniRuntime.screen.height / 2.8,
      sm: miniRuntime.screen.height / 2.8,
      md: miniRuntime.screen.width / 3,
      lg: miniRuntime.screen.width / 3,
      xl: miniRuntime.screen.width / 4,
    },
    width: {
      xs: miniRuntime.screen.width,
      sm: miniRuntime.screen.width,
      md: undefined,
      lg: undefined,
      xl: undefined,
    },
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
