import { Alert, SafeAreaView, View } from 'react-native';
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
import { useMemo } from 'react';
import { useBoundStore } from '@/store';
import LabelButton from '@/components/buttons/LabelButton';
import { translate } from '@/core';
import useHandleSwitchDatabase from '@/screens/Settings/pages/DatabaseSettings/useHandleSwitchDatabase';

const DatabaseSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack, navigate } = useNavigation();

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

  const databaseUserVersion = useMemo(
    // @ts-ignore
    () => database?.getFirstSync('PRAGMA user_version')?.user_version,
    []
  );

  const handleNavigateToDatabaseDetails = () => {
    navigate(Routes.DatabaseEditor);
  };

  const showTestSettings = !__DEV__;
  const isSyncEnabled = useBoundStore((state) => state.shouldSync);
  const groupName = useBoundStore((state) => state.profile?.groupName);

  const { handleSwitchDatabase } = useHandleSwitchDatabase();

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />

      <View style={styles.container}>
        <Typography variant={'titleLarge'}>Vault Settings.</Typography>
        <InfoLabelButton
          title={isSyncEnabled ? 'Cloud Vault:' : 'Local Vault:'}
          buttonTitle={groupName || 'Local Vault'}
          iconSource={isSyncEnabled ? 'cloud' : 'vault'}
        />
        <LabelButton
          title={isSyncEnabled ? 'Switch to local vault' : 'Switch to cloud vault'}
          onPress={handleSwitchDatabase}
        />
        {showTestSettings && (
          <InfoLabelButton title={'Version'} buttonTitle={databaseUserVersion} />
        )}

        {showTestSettings && (
          <SettingsButton
            title={'Open Database Details'}
            onPress={handleNavigateToDatabaseDetails}
            iconSource={'settings'}
          />
        )}
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
    </SafeAreaView>
  );
};

export default DatabaseSettings;
