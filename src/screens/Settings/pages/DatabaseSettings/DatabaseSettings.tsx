import { FlatList, View } from 'react-native';
import Typography from '@/components/Typography';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { useBoundStore } from '@/store';
import useHandleSwitchDatabase from './useHandleSwitchDatabase';
import { Env } from '@/core/env';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useMemo, useRef, useState } from 'react';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import AddButton from '@/components/buttons/AddButton';
import SettingsContainer from '@/components/SettingsContainer';
import useHasPremium from '@/services/pro/useHasPremium';
import OutlineButton from '@/components/buttons/OutlineButton';
import LabelButton from '@/components/buttons/LabelButton';
import DatabaseSettingsOptions from '@/screens/Settings/pages/DatabaseSettings/DatabaseSettingsOptions';
import DatabaseSettingsItem from '@/screens/Settings/pages/DatabaseSettings/DatabaseSettingsItem';
import { DatabaseObject } from '@/types';
import { translate } from '@/core'; // Ensure you have the translate function imported

const DatabaseSettingsScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { navigate } = useNavigation();

  const createJoinBottomSheetRef = useRef<BottomSheetRef>(null);
  const vaultOptionsBottomSheetRef = useRef<BottomSheetRef>(null);

  const currentGroupId = useBoundStore((state) => state.profile.groupId);

  const { handleSwitchDatabase, availableGroups, hasMaxDatabases } = useHandleSwitchDatabase();
  const isLoggedIn = useIsLoggedIn();
  const hasPremium = useHasPremium();

  const [selectedVault, setSelectedVault] = useState<DatabaseObject | undefined>();

  const navigateToCreateVault = () => {
    createJoinBottomSheetRef.current?.dismiss();
    navigate(Routes.CreateVault);
  };

  const navigateToJoinVault = () => {
    createJoinBottomSheetRef.current?.dismiss();
    navigate(Routes.JoinVault);
  };

  const handleCreateOrJoinVault = () => {
    if (isLoggedIn) {
      createJoinBottomSheetRef.current?.present();
    } else {
      navigate(Routes.Login, { showSkip: false });
    }
  };

  // Prepare data for current vault and available vaults
  const currentVaultData = useMemo(
    () => availableGroups.find((group) => group.id === currentGroupId),
    [currentGroupId, availableGroups],
  );

  const availableVaults = useMemo(
    () => availableGroups.filter((group) => group.id !== currentGroupId),
    [availableGroups, currentGroupId],
  );

  const handleItemPress = (item: DatabaseObject) => {
    setSelectedVault(item);
    vaultOptionsBottomSheetRef.current?.present();
  };

  const renderItem = ({ item }: { item: DatabaseObject | undefined }) => (
    <DatabaseSettingsItem item={item} onPress={handleItemPress} />
  );

  const handleUpgradeToCloudVault = () => {
    vaultOptionsBottomSheetRef.current?.dismiss();

    if (isLoggedIn) {
      navigate(Routes.MigrateToCloud);
    } else {
      navigate(Routes.Login, { showSkip: false });
    }
  };

  const isLocalVault = currentVaultData?.id === Env.LOCAL_GROUP_ID;
  const isCurrentSharedVault = currentVaultData?.isShared;

  return (
    <SettingsContainer title={translate('database_settings.title')}>
      <View style={styles.contentContainer}>
        <View style={styles.currentVaultContainer}>
          <Typography variant="titleMedium" style={styles.vaultTitle}>
            {translate('database_settings.current_vault')}
          </Typography>
          {currentVaultData && (
            <DatabaseSettingsItem item={currentVaultData} onPress={handleItemPress} />
          )}

          {isLocalVault && (
            <LabelButton
              title={translate('database_settings.enable_cloud_vault')}
              onPress={handleUpgradeToCloudVault}
              style={styles.migrationLabelButton}
            />
          )}

          {currentVaultData?.id !== Env.LOCAL_GROUP_ID && !hasPremium && !isCurrentSharedVault && (
            <LabelButton
              title={translate('database_settings.unlock_premium_features')}
              onPress={() => navigate(Routes.ProPlan)}
              style={styles.migrationLabelButton}
            />
          )}
        </View>

        {/* Other Vaults Section */}
        {availableVaults.length > 0 && (
          <View style={styles.otherVaultsContainer}>
            <Typography variant="titleMedium" style={styles.vaultTitle}>
              {translate('database_settings.other_vaults')}
            </Typography>
            <FlatList
              data={availableVaults}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}
        {!hasMaxDatabases && (
          <View style={styles.createVaultButtonContainer}>
            <AddButton
              style={styles.addVaultButton}
              title={translate('database_settings.add_vault_button')}
              onPress={handleCreateOrJoinVault}
            />
          </View>
        )}

        {/* Bottom Sheets */}
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

        <DatabaseSettingsOptions
          vaultOptionsBottomSheetRef={vaultOptionsBottomSheetRef}
          selectedVault={selectedVault}
          currentGroupId={currentGroupId}
          handleSwitchDatabase={handleSwitchDatabase}
        />
      </View>
      {!isLoggedIn && (
        <View style={styles.footer}>
          <Typography style={styles.footerText}>
            {translate('database_settings.login_to_sync')}
          </Typography>
          <OutlineButton
            title={translate('settings.login')}
            onPress={() => navigate(Routes.Login, { showSkip: false })}
            style={styles.footerButton}
          />
        </View>
      )}

      {isLoggedIn && !hasPremium && (
        <View style={styles.footer}>
          <Typography style={styles.footerText}>
            {translate('database_settings.unlock_premium_features')}
          </Typography>
          <OutlineButton
            title={translate('general_settings.upgrade_account')}
            onPress={() => navigate(Routes.ProPlan)}
            style={styles.footerButton}
          />
        </View>
      )}
    </SettingsContainer>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    flex: 1,
  },
  currentVaultContainer: {
    paddingTop: 20,
  },
  otherVaultsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  vaultTitle: {
    color: theme.colors.primary,
    marginVertical: 8,
  },
  addVaultButton: {
    marginTop: 20,
  },
  createVaultButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSheetContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.onBackground,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  footerButton: {
    width: '100%',
  },
  migrationLabelButton: {
    marginTop: 10,
  },
}));

export default DatabaseSettingsScreen;
