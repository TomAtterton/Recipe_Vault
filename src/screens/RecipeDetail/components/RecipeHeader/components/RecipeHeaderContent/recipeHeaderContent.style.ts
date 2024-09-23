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
    paddingVertical: 20,
  },
  contentContainer: {
    flexDirection: {
      xs: 'row',
      sm: 'column',
      md: 'column',
      lg: 'column',
      xl: 'column',
    },
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  timesContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonContainer: {
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
    marginVertical: 20,
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
    right: {
      xs: 20,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
    },
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
