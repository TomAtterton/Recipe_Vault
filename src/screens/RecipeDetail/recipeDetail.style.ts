import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: miniRuntime.insets.top + 64,
  },
  navBar: {
    position: 'absolute',
    right: 16,
    left: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    top: miniRuntime.insets.top + 64 / 3,
  },
}));
