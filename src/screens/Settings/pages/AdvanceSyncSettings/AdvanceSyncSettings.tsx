import SettingsButton from '@/components/buttons/SettingsButton';
import { syncPush } from '@/services/sync/syncPush';
import { syncPull } from '@/services/sync/syncPull';
import * as React from 'react';
import { setLastSynced, useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import SettingsContainer from '@/components/SettingsContainer';

const AdvanceSyncSettings = () => {
  const lastSynced = useBoundStore((state) => state.lastSynced);
  const profile = useBoundStore((state) => state.profile);

  return (
    <SettingsContainer title={translate('advance_sync_settings.title')}>
      <InfoLabelButton
        title={translate('advance_sync_settings.current_vault')}
        buttonTitle={profile?.groupName}
      />
      <InfoLabelButton title={translate('settings.group_id')} buttonTitle={profile?.groupId} />
      {/*<InfoLabelButton title={translate('settings.user_id')} buttonTitle={profile?.id} />*/}
      <InfoLabelButton
        title={translate('settings.database.last_synced')}
        buttonTitle={lastSynced || translate('advance_sync_settings.has_not_synced')}
      />
      <SettingsButton
        title={translate('advance_sync_settings.sync_push')}
        onPress={syncPush}
        iconSource={'cloud'}
      />
      <SettingsButton
        title={translate('advance_sync_settings.sync_pull')}
        onPress={() => syncPull(true)}
        iconSource={'cloud'}
      />
      <SettingsButton
        title={translate('advance_sync_settings.reset_last_synced')}
        onPress={() => setLastSynced(undefined)}
        iconSource={'cloud'}
      />
    </SettingsContainer>
  );
};

export default AdvanceSyncSettings;
