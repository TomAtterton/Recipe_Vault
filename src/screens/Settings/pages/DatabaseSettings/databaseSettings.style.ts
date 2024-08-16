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
  vaultsContainer: {
    paddingTop: 8,
    flex: 0.5,
    gap: 8,
  },
  vaultsScrollView: { flex: 1 },
  vaultsScrollViewContent: { flexGrow: 1 },
  bottomSheetContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
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
