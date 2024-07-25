import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(({ colors }, { screen }) => ({
  container: {
    marginTop: {
      xs: screen.height / 2.8,
      sm: screen.height / 2.8,
      md: 0,
      lg: 0,
      xl: 0,
    },
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContent: {
    marginLeft: 8,
  },
  timeTitle: {
    color: colors.placeholder,
  },
  titleContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  infoButton: {
    position: 'absolute',
    right: 0,
  },
  infoContainer: {
    gap: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  notes: {
    color: colors.placeholder,
  },
}));
