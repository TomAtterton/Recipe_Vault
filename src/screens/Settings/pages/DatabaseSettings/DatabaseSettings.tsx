import { Share, TouchableOpacity, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import * as React from 'react';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import { Routes } from '@/navigation/Routes';
import { useBoundStore } from '@/store';
import useHandleSwitchDatabase from './useHandleSwitchDatabase';
import { Env } from '@/core/env';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useRef } from 'react';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import Icon from '@/components/Icon';
import { translate } from '@/core';
import AddButton from '@/components/buttons/AddButton';
import SettingsContainer from '@/components/SettingsContainer';

const DatabaseSettingsScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { navigate } = useNavigation();

  const createJoinBottomSheetRef = useRef<BottomSheetRef>(null);
  const manageVaultBottomSheetRef = useRef<BottomSheetRef>(null);

  const currentGroupId = useBoundStore((state) => state.profile.groupId);
  const databaseName = useBoundStore((state) => state.currentDatabaseName);
  const { handleSwitchDatabase, availableGroups } = useHandleSwitchDatabase();

  const navigateToCreateVault = () => {
    createJoinBottomSheetRef.current?.dismiss();
    navigate(Routes.CreateVault);
  };

  const navigateToJoinVault = () => {
    createJoinBottomSheetRef.current?.dismiss();
    navigate(Routes.JoinVault);
  };

  const isLoggedIn = useIsLoggedIn();

  const handleCreateOrJoinVault = () => {
    if (isLoggedIn) {
      createJoinBottomSheetRef.current?.present();
    } else {
      navigate(Routes.Login, { showSkip: false });
    }
  };

  const isLocalVault = currentGroupId === Env.TEST_GROUP_ID;

  return (
    <SettingsContainer title={translate('database_settings.title')}>
      <InfoLabelButton
        title={translate('database_settings.current_vault')}
        buttonTitle={databaseName}
        onPress={() => manageVaultBottomSheetRef.current?.present()}
        iconSource={isLocalVault ? 'vault' : 'cloud'}
      />
      {availableGroups && availableGroups.length < 3 && (
        <AddButton
          style={styles.addVaultButton}
          title={translate('database_settings.add_vault_button')}
          onPress={handleCreateOrJoinVault}
        />
      )}
      <View style={styles.vaultsContainer}>
        <SettingsButton
          title={translate('database_settings.switch_vault')}
          onPress={() => manageVaultBottomSheetRef.current?.present()}
          iconSource="vault"
        />
        {!isLocalVault && (
          <SettingsButton
            title={translate('database_settings.share_vault')}
            onPress={async () => {
              await Share.share({
                title: 'Share database code with a friend',
                message: currentGroupId || '',
              });
            }}
            iconSource="paper-plane"
          />
        )}
        <SettingsButton
          title={translate('database_settings.advanced_vault_settings')}
          onPress={() => navigate(Routes.AdvanceVaultSettings)}
          iconSource="cog"
        />
      </View>
      <BottomSheet
        bottomSheetRef={createJoinBottomSheetRef}
        title={translate('database_settings.add_vault_bottom_sheet_title')}
      >
        <View style={styles.bottomSheetContainer}>
          <SettingsButton
            iconSource="cloud"
            title={translate('database_settings.create_vault')}
            onPress={navigateToCreateVault}
          />
          <SettingsButton
            iconSource="cloud"
            title={translate('database_settings.join_vault')}
            onPress={navigateToJoinVault}
          />
        </View>
      </BottomSheet>
      <BottomSheet
        bottomSheetRef={manageVaultBottomSheetRef}
        title={translate('database_settings.switch_vault_bottom_sheet_title')}
        snapPoints={['80%']}
      >
        <View style={styles.bottomSheetContainer}>
          <Typography variant="titleMedium" style={styles.vaultTitle}>
            {translate('database_settings.cloud_vaults')}
          </Typography>
          {availableGroups.length > 0
            ? availableGroups.map((group) => {
                if (group.id === currentGroupId) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    key={group.id}
                    style={styles.vaultItem}
                    onPress={async () => {
                      await handleSwitchDatabase(group.id);
                      manageVaultBottomSheetRef.current?.dismiss();
                    }}
                  >
                    <Icon name="cloud" size={18} color="white" />
                    <Typography>{group.name}</Typography>
                  </TouchableOpacity>
                );
              })
            : null}
          <Typography variant="titleMedium" style={styles.vaultTitle}>
            {translate('database_settings.local_vault')}
          </Typography>
          <TouchableOpacity
            style={styles.vaultItem}
            onPress={async () => {
              await handleSwitchDatabase(Env.TEST_GROUP_ID);
              manageVaultBottomSheetRef.current?.dismiss();
            }}
          >
            <Icon name="vault" size={18} color="white" />
            <Typography>{translate('database_settings.local_vault')}</Typography>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SettingsContainer>
  );
};

export default DatabaseSettingsScreen;
