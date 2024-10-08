import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  itemStyle: {
    color: theme.colors.onBackground,
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
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 20,
  },
  saveTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
}));
