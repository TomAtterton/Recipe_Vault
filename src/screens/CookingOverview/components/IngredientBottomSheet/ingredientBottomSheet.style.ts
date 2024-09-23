import { createStyleSheet } from 'react-native-unistyles';

export const styleSheet = createStyleSheet((theme) => ({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.lightBackground,
  },
  indicatorContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 3,
    backgroundColor: theme.colors.onBackground80,
    width: 40,
    alignSelf: 'center',
    borderRadius: 20,
  },
  menuView: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    marginTop: 12,
  },
  title: {},
  ingredientHeader: {
    position: 'absolute',
    paddingTop: 32,
    paddingHorizontal: 20,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    flexDirection: 'row',
  },
  checkBox: {
    paddingVertical: 8,
    flex: 1,
  },
  ingredientsList: {
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  inactiveDot: {
    backgroundColor: theme.colors.placeholder,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'black',
  },
}));
