import { Alert, SafeAreaView, ScrollView, Share, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { database, onDeleteDatabase, onOpenDatabase } from '@/database';
import * as React from 'react';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import { deleteDatabaseAsync } from 'expo-sqlite/next';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import { Routes } from '@/navigation/Routes';
import { useBoundStore } from '@/store';
import { translate } from '@/core';
import useHandleSwitchDatabase from './useHandleSwitchDatabase';
import { Env } from '@/core/env';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useRef } from 'react';
import LabelButton from '@/components/buttons/LabelButton';

const DatabaseSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack, navigate } = useNavigation();

  const createJoinBottomSheetRef = useRef<BottomSheetRef>(null);
  const sharedVaultBottomSheetRef = useRef<BottomSheetRef>(null);
  const handleResetDatabase = async () => {
    try {
      Alert.alert(
        translate('prompt.reset_database.title'),
        translate('prompt.reset_database.message'),
        [
          {
            text: translate('default.cancel'),
            style: 'cancel',
          },
          {
            text: translate('default.ok'),
            onPress: async () => {
              if (database?.databaseName) {
                await database.closeAsync();
                await deleteDatabaseAsync(database?.databaseName);
                await onOpenDatabase({
                  currentDatabaseName: database.databaseName,
                  shouldClose: false,
                });
                showSuccessMessage('Database reset successfully');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log('error', error);
      showErrorMessage('Error resetting database');
    }
  };

  const handleClearDatabase = async () => {
    try {
      Alert.alert(
        translate('prompt.clear_database.title'),
        translate('prompt.clear_database.message'),
        [
          {
            text: translate('default.cancel'),
            style: 'cancel',
          },
          {
            text: translate('default.ok'),
            onPress: async () => {
              await onDeleteDatabase(database);
              showSuccessMessage(translate('prompt.clear_database.success_message'));
            },
          },
        ]
      );
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('prompt.clear_database.error_message'));
    }
  };

  const isSyncEnabled = useBoundStore((state) => state.shouldSync);

  const { handleSwitchDatabase, groups } = useHandleSwitchDatabase();

  const handleNavigateToCreateVault = () => {
    createJoinBottomSheetRef.current?.dismiss();
    navigate(Routes.CreateVault);
  };

  const handleNavigateToJoinVault = () => {
    createJoinBottomSheetRef.current?.dismiss();
    navigate(Routes.JoinVault);
  };

  const [selectedDatabaseId, setSelectedDatabaseId] = React.useState<string | null>(null);

  const handleManageDatabase = (id: string) => {
    sharedVaultBottomSheetRef.current?.present();
    setSelectedDatabaseId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleLarge'}>Vault Settings.</Typography>
        <View style={styles.vaultsContainer}>
          <ScrollView
            style={styles.vaultsScrollView}
            contentContainerStyle={styles.vaultsScrollViewContent}
          >
            {groups.length > 0
              ? groups.map((group) => (
                  <InfoLabelButton
                    key={group.id}
                    title={'Cloud Vault:'}
                    buttonTitle={group.name}
                    leftIconSource={isSyncEnabled ? 'star-bold' : undefined}
                    iconSource={'cloud'}
                    onPress={() => handleManageDatabase(group.id)}
                  />
                ))
              : null}

            <InfoLabelButton
              title={'Local Vault:'}
              buttonTitle={'Local Vault'}
              iconSource={'vault'}
              leftIconSource={!isSyncEnabled ? 'star-bold' : undefined}
              onPress={() => handleManageDatabase(Env.TEST_GROUP_ID)}
            />
            <LabelButton
              title={'+ Create or Join a Vault'}
              onPress={() => createJoinBottomSheetRef.current?.present()}
            />
          </ScrollView>
        </View>
        <View style={styles.dangerZoneContainer}>
          <Typography variant={'titleLarge'} style={styles.dangerZoneTitle}>
            Danger Zone:
          </Typography>
          <Typography variant={'bodyMedium'}>
            Having trouble with the app? Try these options:
          </Typography>
          <SettingsButton
            title={'Clear All Recipes'}
            onPress={handleClearDatabase}
            iconSource={'bin'}
          />
          <SettingsButton
            title={'Delete and Reset Vault'}
            onPress={handleResetDatabase}
            iconSource={'bin'}
          />
        </View>
      </View>
      <BottomSheet bottomSheetRef={createJoinBottomSheetRef} title={'Add a vault'}>
        <View
          style={{
            flex: 1,
            gap: 16,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <SettingsButton
            iconSource={'cloud'}
            title={'Create a new Vault'}
            onPress={handleNavigateToCreateVault}
          />
          <SettingsButton
            iconSource={'cloud'}
            title={'Join a Vault'}
            onPress={handleNavigateToJoinVault}
          />
        </View>
      </BottomSheet>

      <BottomSheet bottomSheetRef={sharedVaultBottomSheetRef} title={'Manage Vault'}>
        <View
          style={{
            flex: 1,
            gap: 16,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <SettingsButton
            iconSource={'cloud'}
            title={'Switch Vault'}
            onPress={() => {
              selectedDatabaseId && handleSwitchDatabase(selectedDatabaseId);
              sharedVaultBottomSheetRef.current?.dismiss();
            }}
          />
          {selectedDatabaseId !== Env.TEST_GROUP_ID && (
            <SettingsButton
              iconSource={'share'}
              title={'Share Vault'}
              onPress={async () => {
                await Share.share({
                  title: 'Share database code with a friend',
                  message: selectedDatabaseId || '',
                });
                sharedVaultBottomSheetRef.current?.dismiss();
              }}
            />
          )}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default DatabaseSettings;
