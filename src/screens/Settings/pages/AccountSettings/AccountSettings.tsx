import { SafeAreaView, View, Alert } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import * as React from 'react';
import { setResetDatabase, setResetProfile, useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './accountSettings.style';
import OutlineButton from '@/components/buttons/OutlineButton';
import { onOpenDatabase } from '@/database';
import { Env } from '@/core/env';
import { onDeleteUser, onSignOut } from '@/services/auth';
import { showErrorMessage } from '@/utils/promptUtils';

const AccountSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

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
                throw new Error(translate('error.delete_account.error_message'));
              }

              await onSignOut();

              setResetProfile();
              setResetDatabase();

              await onOpenDatabase({
                currentDatabaseName: Env.SQLITE_DB_NAME,
              });
            } catch (error) {
              showErrorMessage(translate('error.default.error_title'));
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>Account Settings.</Typography>
        <InfoLabelButton title={'Name:'} buttonTitle={name} />
        <InfoLabelButton title={'Email:'} buttonTitle={email} />
        <View style={styles.dangerZoneContainer}>
          <Typography variant={'titleLarge'} style={styles.dangerZoneTitle}>
            Danger Zone:
          </Typography>
          <Typography variant={'bodyMedium'}>
            Having trouble with the app? Try these options:
          </Typography>
          <OutlineButton
            title={'Delete Account'}
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountSettings;
