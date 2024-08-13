import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    // Flex isn't calculated correctly with bottom sheet so we do caluclations based on 80% screen height with top insets and 20 padding
    height: miniRuntime.screen.height * 0.8 - miniRuntime.insets.top - 20,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    gap: 20,
    paddingVertical: 20,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
}));
