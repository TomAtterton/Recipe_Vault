import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 40,
    paddingBottom: miniRuntime.insets.bottom,
    paddingHorizontal: 20,
  },
  blur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  featureContainer: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowTitle: {
    paddingLeft: 8,
    color: theme.colors.primary,
  },
  infoButton: {
    position: 'absolute',
    right: -10,
  },
  loginButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.primary,
    paddingBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.onBackground,
  },
  dividerText: {
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'white',
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: miniRuntime.insets.top,
    left: 0,
  },

  image: {
    width: '100%',
    height: '100%',
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background40,
  },
  proPlanTitle: {
    color: theme.colors.onBackground,
    textAlign: 'center',
    paddingBottom: 20,
    paddingTop: 8,
  },
  proContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  proPlanDescription: {
    color: theme.colors.onBackground80,
    textAlign: 'center',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
}));
