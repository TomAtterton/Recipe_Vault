import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    // @ts-ignore
    backgroundColor: theme.colors.inputBackground,
  },
  squircleContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cancelButton: {
    top: 2,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
}));
