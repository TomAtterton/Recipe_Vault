import { createStyleSheet } from 'react-native-unistyles';

const CHECKBOX_SIZE = 32;

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 16,
  },
  checkbox: {
    flex: 0,
  },
  contentContainer: {
    flex: 1,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    width: CHECKBOX_SIZE / 2,
    height: CHECKBOX_SIZE / 2,
    borderRadius: 2,
  },
  inputContainer: {
    flex: 1,
  },
}));
