import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: theme.colors.background,
  },
  indicatorContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 3,
    backgroundColor: theme.colors.onBackground,
    width: 40,
    alignSelf: 'center',
    borderRadius: 20,
  },
  contentContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: theme.colors.lightBackground,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 50,
  },
  textInput: {
    textAlignVertical: 'top',
  },
  description: {
    color: theme.colors.primary,
    paddingTop: 10,
    paddingLeft: 10,
  },
  deleteButton: {
    position: 'absolute',
    left: 0,
  },
  actionBarContainer: {
    position: 'absolute',
    bottom: 8,
    right: 0,
    left: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 16,
  },
}));
