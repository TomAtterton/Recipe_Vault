import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 40,
    paddingBottom: miniRuntime.insets.bottom,
    marginHorizontal: 20,
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
    gap: 20,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  featureContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowTitle: {
    paddingLeft: 8,
    color: theme.colors.primary,
  },
  proPlanTitle: {
    paddingBottom: 8,
    color: theme.colors.primary,
    textAlign: 'center',
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
  loginButton: {
    width: miniRuntime.screen.width / 1.5,
    height: 50,
  },
  backButton: {
    position: 'absolute',
    top: miniRuntime.insets.top,
    left: 8,
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
}));
