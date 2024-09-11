import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.lightBackground,
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    gap: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    overflow: 'hidden',
  },
  inputTitle: {
    color: theme.colors.placeholder,
  },
  chipContainer: {
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  chipText: {
    color: theme.colors.background,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  listHeaderContainer: {
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  input: {
    color: 'white',
  },
  newCategoryInput: {
    marginBottom: 8,
  },
  selectedIcon: {
    marginRight: 20,
  },
  selectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    // fontWeight: 'bold',
  },
  selectItemDelete: {},
}));
