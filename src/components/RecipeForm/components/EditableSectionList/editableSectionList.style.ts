import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    flex: 1,
  },
  reorder: {
    right: 0,
    position: 'absolute',
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
  },
  emptyView: {
    paddingVertical: 16,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
