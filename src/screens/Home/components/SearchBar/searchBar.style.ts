import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  squircleContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cancelButton: {
    // Fix y position
    top: 2,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
});
