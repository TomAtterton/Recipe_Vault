import { SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { syncPush } from '@/database/supabase/syncPush';
import { syncPull } from '@/database/supabase/syncPull';
import * as React from 'react';
import { setLastSynced, useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './advanceSyncSettings.style';

const AdvanceSyncSettings = () => {
  const { styles } = useStyles(stylesheet);
  const lastSynced = useBoundStore((state) => state.lastSynced);
  const { goBack } = useNavigation();
  const profile = useBoundStore((state) => state.profile);

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>Advance Sync Settings.</Typography>
        <InfoLabelButton title={'Current Vault.'} buttonTitle={profile?.groupName} />
        <InfoLabelButton title={translate('settings.group_id')} buttonTitle={profile?.groupId} />
        <InfoLabelButton title={translate('settings.user_id')} buttonTitle={profile?.id} />
        <InfoLabelButton
          title={translate('settings.database.last_synced')}
          buttonTitle={lastSynced || 'has not synced'}
        />
        <SettingsButton title={'Sync Push'} onPress={syncPush} iconSource={'cloud'} />
        <SettingsButton title={'Sync Pull'} onPress={() => syncPull(true)} iconSource={'cloud'} />
        <SettingsButton
          title={'Reset last synced'}
          onPress={() => setLastSynced(undefined)}
          iconSource={'cloud'}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdvanceSyncSettings;
