import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, { screen: { width } }) => ({
  container: {
    flex: 1,
  },
  scrollView: {
    width: width,
  },
  onboardingView: {
    width,
    paddingTop: 80,
    gap: 20,
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
