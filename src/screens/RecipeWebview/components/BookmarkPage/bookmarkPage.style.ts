import { createStyleSheet } from 'react-native-unistyles';

export const SEARCH_BAR_HEIGHT = 60;

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginTop: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    zIndex: 100,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  bookmarkTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingRight: 8,
  },
  clearTitle: {
    color: theme.colors.primary,
  },
  deleteAllHistoryButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
}));
