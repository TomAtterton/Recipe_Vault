import { createStyleSheet } from 'react-native-unistyles';

export const SEARCH_BAR_HEIGHT = 60;
export const ICON_SIZE = 24;
export const INPUT_HEIGHT = 45;

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingBottom: 20,
    marginHorizontal: 20,
    height: SEARCH_BAR_HEIGHT,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },

  inputContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 10,
    height: INPUT_HEIGHT,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    width: '50%',
    paddingLeft: 8,
    height: INPUT_HEIGHT,
  },
  title: {
    position: 'absolute',
    left: (ICON_SIZE + 8) * 2,
    right: (ICON_SIZE + 8) * 2,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: theme.colors.background,
  },
  cancelButton: {
    paddingLeft: 8,
  },
}));
