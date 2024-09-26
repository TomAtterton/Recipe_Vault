import { createStyleSheet } from 'react-native-unistyles';

const COLOR_INDICATOR_SIZE = 15;

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  buttonContainer: {
    justifyContent: 'center',
    backgroundColor: theme.colors.lightBackground,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: miniRuntime.insets.bottom,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorIndicator: {
    marginRight: 16,
    height: COLOR_INDICATOR_SIZE,
    width: COLOR_INDICATOR_SIZE,
    borderRadius: COLOR_INDICATOR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContentContainer: {
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    paddingRight: 16,
    paddingLeft: 8,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  title: {
    color: theme.colors.primary,
  },
}));
