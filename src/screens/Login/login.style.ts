import metrics from '@/theme/metrics';
import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  loginButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.primary,
    paddingBottom: 20,
  },
  loginButton: {
    width: metrics.screenWidth / 1.5,
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
}));
