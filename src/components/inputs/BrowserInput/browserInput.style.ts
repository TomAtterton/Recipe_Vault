import { createStyleSheet } from 'react-native-unistyles';

export const SEARCH_BAR_HEIGHT = 60;
export const ICON_SIZE = 24;
export const INPUT_HEIGHT = 45;

export const stylesheet = createStyleSheet((theme, { insets: { top } }) => ({
  container: {
    paddingBottom: 20,
    marginHorizontal: 20,
    height: SEARCH_BAR_HEIGHT,
    justifyContent: 'center',
    marginTop: top + 20,
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
    paddingLeft: 8,
    height: INPUT_HEIGHT,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: theme.colors.background,
  },
  loadingBar: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    right: 4,
    backgroundColor: theme.colors.primary,
    height: 2,
  },
  cancelButton: {
    paddingLeft: 8,
  },
  shareButton: {
    paddingTop: 8,
    paddingLeft: 8,
  },
}));
