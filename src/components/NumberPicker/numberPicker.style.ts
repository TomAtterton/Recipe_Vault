import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  itemStyle: {
    color: 'white',
  },
  selectedNumber: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 20,
  },
  saveTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
});
