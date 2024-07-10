import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    flex: 1,
  },
});
