import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    minHeight: {
      xs: miniRuntime.screen.height / 3.5,
      sm: miniRuntime.screen.height / 3.5,
      md: miniRuntime.screen.height / 4.5,
      lg: miniRuntime.screen.height / 3.5,
    },
  },
  title: {},
  subTitle: {
    paddingTop: 8,
    color: theme.colors.primary,
  },
  textContainer: {
    height: {
      xs: miniRuntime.screen.height / 3.5,
      sm: miniRuntime.screen.height / 3.5,
      md: miniRuntime.screen.height / 4.5,
      lg: miniRuntime.screen.height / 3.5,
    },
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
}));
