import { createStyleSheet } from 'react-native-unistyles';
import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
  scrollView: {
    width: SCREEN_WIDTH,
  },
  onboardingView: {
    width: SCREEN_WIDTH,
    paddingTop: 80,
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  onboardingTitle: {
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 20,
  },
}));
