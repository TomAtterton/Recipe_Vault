import { createStyleSheet } from 'react-native-unistyles';

const COLOR_INDICATOR_SIZE = 15;

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  buttonContainer: {
    justifyContent: 'center',
    backgroundColor: theme.colors.lightBackground,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 20,
    paddingBottom: miniRuntime.insets.bottom + 20,
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
  description: {
    color: theme.colors.onBackground80,
    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    left: 20,
    bottom: miniRuntime.insets.bottom,
  },
  addButton: {
    width: '80%',
    alignSelf: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
}));
