import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  dangerZoneTitle: {
    color: theme.colors.primary,
  },
  dangerZoneContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 16,

    paddingBottom: 20,
  },
}));
