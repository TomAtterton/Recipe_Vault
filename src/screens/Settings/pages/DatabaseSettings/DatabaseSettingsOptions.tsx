import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { Share, View } from 'react-native';
import Typography from '@/components/Typography';
import { Env } from '@/core/env';
import SettingsButton from '@/components/buttons/SettingsButton';
import { Routes } from '@/navigation/Routes';
import * as React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { DatabaseObject } from '@/types';

const DatabaseSettingsOptions = ({
  vaultOptionsBottomSheetRef,
  selectedVault,
  currentGroupId,
  handleSwitchDatabase,
}: {
  vaultOptionsBottomSheetRef: React.RefObject<BottomSheetRef>;
  selectedVault?: DatabaseObject;
  currentGroupId: string;
  handleSwitchDatabase: (id: string) => Promise<void>;
}) => {
  const { navigate } = useNavigation();
  const { styles } = useStyles(stylesheet);

  return (
    <BottomSheet
      bottomSheetRef={vaultOptionsBottomSheetRef}
      title={selectedVault ? selectedVault.name : 'Vault Options'}
    >
      <View style={styles.bottomSheetContainer}>
        {selectedVault && (
          <Typography variant={'bodyMediumItalic'} style={styles.vaultDescription}>
            {selectedVault?.id === Env.LOCAL_GROUP_ID
              ? 'This vault is securely stored on your device and not synced to the cloud.'
              : selectedVault?.isShared
                ? 'This vault was shared with you by someone else.'
                : 'This vault is stored securely in the cloud for easy access.'}
          </Typography>
        )}

        {selectedVault && selectedVault.id !== currentGroupId && (
          <SettingsButton
            title="Switch to this Vault"
            onPress={async () => {
              await handleSwitchDatabase(selectedVault.id);
              vaultOptionsBottomSheetRef.current?.dismiss();
            }}
            iconSource="vault"
          />
        )}

        <SettingsButton
          title="Advanced Settings"
          onPress={() => {
            vaultOptionsBottomSheetRef.current?.dismiss();
            selectedVault &&
              navigate(Routes.AdvanceVaultSettings, {
                id: selectedVault.id,
                name: selectedVault.name,
                isShared: selectedVault.isShared,
              });
          }}
          iconSource="cog"
        />

        {selectedVault?.id !== Env.LOCAL_GROUP_ID && !selectedVault?.isShared && (
          <SettingsButton
            title="Share this Vault"
            onPress={async () => {
              vaultOptionsBottomSheetRef.current?.dismiss();
              await Share.share({
                title: 'Share this vault with a friend',
                message: `Vault ID: ${selectedVault?.id || ''}`,
              });
            }}
            iconSource="paper-plane"
          />
        )}
      </View>
    </BottomSheet>
  );
};

const stylesheet = createStyleSheet(() => ({
  bottomSheetContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  vaultDescription: {
    marginBottom: 16,
  },
}));

export default DatabaseSettingsOptions;
