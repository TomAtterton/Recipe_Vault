import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  dayColumn: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.onBackground,
    marginBottom: 16,
  },
  dayHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingTop: 12,
    gap: 16,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  plusIconContainer: {
    // Give large width to make it easier to press
    width: 200,
    alignItems: 'flex-end',
  },
}));
