import { View, Alert } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import * as React from 'react';
import { useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import { stylesheet } from './accountSettings.style';
import OutlineButton from '@/components/buttons/OutlineButton';
import { onDeleteUser, onSignOut } from '@/services/auth';
import { showErrorMessage } from '@/utils/promptUtils';
import SettingsContainer from '@/components/SettingsContainer';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { setupDatabase } from '@/utils/databaseUtils';
import { Env } from '@/core/env';

const AccountSettings = () => {
  const { styles } = useStyles(stylesheet);

  const name = useBoundStore((state) => state.profile.name);
  const email = useBoundStore((state) => state.profile.email);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      translate('prompt.delete_account.title'),
      translate('prompt.delete_account.message'),
      [
        {
          text: translate('default.cancel'),
          style: 'cancel',
        },
        {
          text: translate('default.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const { error } = await onDeleteUser();

              if (error) {
                throw new Error(translate('prompt.delete_account.error_message'));
              }
              await onSignOut();

              await setupDatabase({ databaseName: Env.SQLITE_DB_NAME });
            } catch (error) {
              showErrorMessage(translate('default.error_message'));
              console.log('Error deleting account', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setupDatabase({ databaseName: Env.SQLITE_DB_NAME });
      await onSignOut();
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.TabStack }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPremium = useBoundStore((state) => state.hasPremium);

  return (
    <SettingsContainer title={translate('account_settings.title')}>
      <InfoLabelButton title={translate('account_settings.name')} buttonTitle={name} />
      <InfoLabelButton title={translate('account_settings.email')} buttonTitle={email} />
      <InfoLabelButton
        title={translate('account_settings.status')}
        buttonTitle={hasPremium ? translate('default.premium') : translate('default.free')}
      />
      <OutlineButton
        style={styles.logoutButton}
        title={translate('settings.logout')}
        onPress={handleSignOut}
        isLoading={isLoading}
      />
      <View style={styles.dangerZoneContainer}>
        <Typography variant={'titleLarge'} style={styles.dangerZoneTitle}>
          {translate('account_settings.danger_zone')}
        </Typography>
        <Typography variant={'bodyMedium'}>
          {translate('account_settings.danger_zone_description')}
        </Typography>
        <OutlineButton
          title={translate('account_settings.delete_account')}
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
          isLoading={isLoading}
        />
      </View>
    </SettingsContainer>
  );
};

export default AccountSettings;
