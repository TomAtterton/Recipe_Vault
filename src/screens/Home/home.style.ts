import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {},
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    overflow: 'visible',
    paddingTop: 20,
  },
  cancelButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    alignItems: 'center',
  },
}));
