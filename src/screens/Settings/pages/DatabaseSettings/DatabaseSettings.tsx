import { SafeAreaView, Share, TouchableOpacity, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import * as React from 'react';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import { Routes } from '@/navigation/Routes';
import { useBoundStore } from '@/store';
import useHandleSwitchDatabase from './useHandleSwitchDatabase';
import { Env } from '@/core/env';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useRef } from 'react';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import LabelButton from '@/components/buttons/LabelButton';
import Icon from '@/components/Icon';

const DatabaseSettingsScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack, navigate } = useNavigation();

  const createJoinBottomSheetRef = useRef<BottomSheetRef>(null);
  const manageVaultBottomSheetRef = useRef<BottomSheetRef>(null);

  const groupId = useBoundStore((state) => state.profile.groupId);
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

  const isLocalVault = groupId === Env.TEST_GROUP_ID;

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource="arrow-left" onPress={goBack} />
      <View style={styles.container}>
        <Typography variant="titleLarge">Vault Settings</Typography>
        <InfoLabelButton title="Current Vault:" buttonTitle={databaseName} />
        <InfoLabelButton title="Synced to Cloud:" buttonTitle={isLocalVault ? 'false' : 'true'} />
        <LabelButton
          style={styles.addVaultButton}
          title="+ Create or Join a Vault"
          onPress={handleCreateOrJoinVault}
        />

        <View style={styles.vaultsContainer}>
          <SettingsButton
            title="Switch Vault"
            onPress={() => manageVaultBottomSheetRef.current?.present()}
            iconSource="vault"
          />
          {!isLocalVault && (
            <SettingsButton
              title="Share Vault"
              onPress={async () => {
                await Share.share({
                  title: 'Share database code with a friend',
                  message: groupId || '',
                });
              }}
              iconSource="paper-plane"
            />
          )}
          <SettingsButton
            title="Advanced Vault Settings"
            onPress={() => navigate(Routes.AdvanceVaultSettings)}
            iconSource="cog"
          />
        </View>
      </View>
      <BottomSheet bottomSheetRef={createJoinBottomSheetRef} title="Add a Vault">
        <View style={styles.bottomSheetContainer}>
          <SettingsButton
            iconSource="cloud"
            title="Create a New Vault"
            onPress={navigateToCreateVault}
          />
          <SettingsButton iconSource="cloud" title="Join a Vault" onPress={navigateToJoinVault} />
        </View>
      </BottomSheet>

      <BottomSheet
        bottomSheetRef={manageVaultBottomSheetRef}
        title="Switch Vault"
        snapPoints={['80%']}
      >
        <View style={styles.bottomSheetContainer}>
          <Typography variant="titleMedium" style={styles.vaultTitle}>
            Cloud Vaults
          </Typography>
          {availableGroups.length > 0
            ? availableGroups.map((group) => (
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
              ))
            : null}
          <Typography variant="titleMedium" style={styles.vaultTitle}>
            Local Vault
          </Typography>
          <TouchableOpacity
            style={styles.vaultItem}
            onPress={async () => {
              await handleSwitchDatabase(Env.TEST_GROUP_ID);
              manageVaultBottomSheetRef.current?.dismiss();
            }}
          >
            <Icon name="vault" size={18} color="white" />
            <Typography>Local Vault</Typography>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default DatabaseSettingsScreen;
