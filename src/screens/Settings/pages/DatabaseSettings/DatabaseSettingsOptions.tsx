import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { View } from 'react-native';
import Typography from '@/components/Typography';
import { Env } from '@/core/env';
import SettingsButton from '@/components/buttons/SettingsButton';
import { Routes } from '@/navigation/Routes';
import * as React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { DatabaseObject } from '@/types';
import { translate } from '@/core';

const DatabaseSettingsOptions = ({
  vaultOptionsBottomSheetRef,
  selectedVault,
  currentGroupId,
  handleSwitchDatabase,
  onShare,
}: {
  vaultOptionsBottomSheetRef: React.RefObject<BottomSheetRef>;
  selectedVault?: DatabaseObject;
  currentGroupId: string;
  handleSwitchDatabase: (id: string) => Promise<void>;
  onShare: (id: string, name: string) => void;
}) => {
  const { navigate } = useNavigation();
  const { styles } = useStyles(stylesheet);

  return (
    <BottomSheet
      bottomSheetRef={vaultOptionsBottomSheetRef}
      title={translate('database_settings.manage_vault_title', {
        name: selectedVault?.name || translate('database_settings.unnamed_vault'),
      })}
    >
      <View style={styles.bottomSheetContainer}>
        {selectedVault && (
          <Typography variant={'bodyMediumItalic'} style={styles.vaultDescription}>
            {selectedVault?.id === Env.LOCAL_GROUP_ID
              ? translate('database_settings.local_vault_description')
              : selectedVault?.isShared
                ? translate('database_settings.shared_vault_description')
                : translate('database_settings.personal_vault_description')}
          </Typography>
        )}

        {selectedVault && selectedVault.id !== currentGroupId && (
          <SettingsButton
            title={translate('database_settings.use_this_vault')}
            onPress={async () => {
              await handleSwitchDatabase(selectedVault.id);
              vaultOptionsBottomSheetRef.current?.dismiss();
            }}
            iconSource="vault"
          />
        )}

        <SettingsButton
          title={translate('database_settings.advanced_vault_settings')}
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
            title={translate('database_settings.share_vault')}
            onPress={async () => {
              vaultOptionsBottomSheetRef.current?.dismiss();
              selectedVault?.id && onShare(selectedVault.id, selectedVault.name);
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
