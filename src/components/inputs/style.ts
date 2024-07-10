import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onBackground,
    flex: 1,
    borderRadius: 5,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 12,
  },
  clearButton: {
    height: 45,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
