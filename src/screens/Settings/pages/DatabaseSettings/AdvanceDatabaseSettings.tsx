import { Alert, SafeAreaView, View } from 'react-native';
import { translate } from '@/core';
import { database, onDeleteDatabase, onOpenDatabase } from '@/database';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import { deleteDatabaseAsync } from 'expo-sqlite/next';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import Typography from '@/components/Typography';
import SettingsButton from '@/components/buttons/SettingsButton';
import NavBarButton from '@/components/buttons/NavBarButton';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

const AdvanceDatabaseSettings = () => {
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
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleLarge'}>Advance Database Settings.</Typography>
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

export default AdvanceDatabaseSettings;