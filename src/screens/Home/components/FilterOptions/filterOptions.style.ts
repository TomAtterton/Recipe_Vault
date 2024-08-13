import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  filterButton: {
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    width: 40,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginLeft: 8,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    height: 20,
    width: 20,
    position: 'absolute',
    right: -8,
    top: -8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: miniRuntime.screen.height * 0.8,
  },
  selectedIcon: {
    marginRight: 20,
  },
  selectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  resetButtonHitSlop: {
    top: 20,
    left: 20,
    bottom: 20,
    right: 20,
  },
  content: {
    flex: 0.9,
    paddingHorizontal: 20,
  },
  contentTitle: {
    paddingVertical: 20,
  },
  tagList: {
    gap: 20,
    paddingVertical: 20,
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: miniRuntime.insets.bottom + 20,
  },
}));
