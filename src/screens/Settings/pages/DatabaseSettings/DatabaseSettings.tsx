import { SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { dropTables } from '@/database/sql/initDatabase';
import { database, openDatabase } from '@/database';
import * as React from 'react';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import { deleteDatabaseAsync } from 'expo-sqlite/next';
import { showSuccessMessage } from '@/utils/promptUtils';
import { showErrorMessage } from '@/utils/errorUtils';
import { Routes } from '@/navigation/Routes';
import { useMemo } from 'react';
import { useBoundStore } from '@/store';

const DatabaseSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  const handleResetDatabase = async () => {
    try {
      if (database?.databaseName) {
        await database.closeAsync();
        await deleteDatabaseAsync(database?.databaseName);
        await openDatabase({
          currentDatabaseName: database.databaseName,
          shouldClose: false,
        });
        showSuccessMessage('Database reset successfully');
      }
    } catch (error) {
      console.log('error', error);
      showErrorMessage('Error resetting database');
    }
  };

  const handleClearDatabase = async () => {
    try {
      await dropTables(database);
      showSuccessMessage('Database cleared successfully');
    } catch (error) {
      console.log('error', error);
      showErrorMessage('Error clearing database');
    }
  };
  const databaseUserVersion = useMemo(
    // @ts-ignore
    () => database?.getFirstSync('PRAGMA user_version')?.user_version,
    []
  );

  const { navigate } = useNavigation();
  const handleNavigateToDatabaseDetails = () => {
    navigate(Routes.DatabaseEditor);
  };

  const isBetaModeEnabled = useBoundStore((state) => state.isBetaMode);

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />

      <View style={styles.container}>
        <Typography variant={'titleLarge'}>Database Settings</Typography>
        <InfoLabelButton title={'Name'} buttonTitle={database?.databaseName} />
        <InfoLabelButton title={'Version'} buttonTitle={databaseUserVersion} />
        <SettingsButton
          title={'Reset database'}
          onPress={handleResetDatabase}
          iconSource={'safe'}
        />
        <SettingsButton title={'Clear database'} onPress={handleClearDatabase} iconSource={'bin'} />
        <SettingsButton
          title={'Open Database Details'}
          onPress={handleNavigateToDatabaseDetails}
          iconSource={'settings'}
        />
        {isBetaModeEnabled && (
          <SettingsButton
            title={'Sync Database'}
            onPress={() => navigate(Routes.SyncSettings)}
            iconSource={'cloud'}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DatabaseSettings;
