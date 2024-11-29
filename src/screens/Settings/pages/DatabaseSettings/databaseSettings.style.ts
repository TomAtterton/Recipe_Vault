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
    flex: 1,
    gap: 16,
  },

  vaultTitle: {
    color: theme.colors.primary,
  },
  vaultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: { flex: 1 },
  addVaultButton: {
    marginBottom: 20,
  },
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
    paddingTop: 20,
    gap: 16,
    paddingBottom: 20,
  },
}));
