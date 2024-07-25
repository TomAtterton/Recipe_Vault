import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: {
      xs: miniRuntime.insets.top,
      sm: miniRuntime.insets.top,
      md: miniRuntime.insets.top + 32,
      lg: miniRuntime.insets.top + 32,
      xl: miniRuntime.insets.top + 32,
    },
  },
  navigationHeader: {
    position: 'absolute',
    paddingHorizontal: 20,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  contentContainer: {
    gap: 16,
    flexGrow: 1,
  },
  picker: {},
  input: {},
  editInput: {},
  starRating: {
    alignSelf: 'center',
  },
  button: {
    marginTop: 32,
  },
}));
