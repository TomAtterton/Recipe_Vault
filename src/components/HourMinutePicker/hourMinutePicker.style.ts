import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  picker: {
    width: '35%',
  },
  pickerItem: {
    color: theme.colors.onBackground,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelText: {
    textAlign: 'left',
  },
  saveButton: {
    marginTop: 20,
  },
}));
