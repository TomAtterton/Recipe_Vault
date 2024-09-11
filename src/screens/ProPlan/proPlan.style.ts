import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top,
    paddingBottom: miniRuntime.insets.bottom,
    marginHorizontal: 20,
  },
  headerImage: {
    alignSelf: 'center',
  },
  title: {
    marginVertical: 16,
    textAlign: 'center',
  },
  subTitle: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    gap: 16,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  lifeTimePurchase: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.onBackground,
    marginHorizontal: 8,
  },
  price: {
    alignSelf: 'center',
    color: theme.colors.primary,
  },
  itemText: {
    flex: 1,
    color: theme.colors.primary,
  },
  proButton: { marginBottom: 16 },
  footerText: {
    marginBottom: 16,
    color: theme.colors.primary,
  },
}));
