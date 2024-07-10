import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 16,
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingBottom: 10,
    paddingTop: 20,
    color: theme.colors.onBackground80,
  },
}));
