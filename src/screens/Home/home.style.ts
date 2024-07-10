import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
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
});
