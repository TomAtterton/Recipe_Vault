import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 32,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subTitle: {
    color: theme.colors.primary,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    gap: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  itemText: {
    flex: 1,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    marginBottom: 16,
    color: theme.colors.primary,
  },
}));
