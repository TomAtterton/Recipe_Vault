import { setCurrentDatabaseName, setShouldSync, updateProfile } from '@/store';
import { syncWithSupabase } from '@/services/sync';
import { onOpenDatabase } from '@/database';
import { Env } from '@/core/env';
import { showErrorMessage } from '@/utils/promptUtils';

export const setupDatabase = async ({
  databaseName,
  shouldClose = true,
  shouldSync = true,
}: {
  databaseName: string;
  shouldClose?: boolean;
  shouldSync?: boolean;
}) => {
  try {
    if (!databaseName) throw new Error('Database name not provided');

    const isLocal = databaseName === Env.SQLITE_DB_NAME;

    if (isLocal) {
      updateProfile({
        id: Env.LOCAL_USER_ID,
        groupId: Env.LOCAL_GROUP_ID,
        groupName: Env.SQLITE_DB_NAME,
        groupRole: 'read_write',
      });
    }
    setShouldSync(!isLocal);
    setCurrentDatabaseName(databaseName);
    await onOpenDatabase({ currentDatabaseName: databaseName, shouldClose });

    if (!isLocal && shouldSync) {
      await syncWithSupabase();
    }
  } catch (e) {
    const isLocal = databaseName === Env.SQLITE_DB_NAME;
    // @ts-ignore
    if (e?.code === 'ERR_INTERNAL_SQLITE_ERROR' && !isLocal) {
      await setupDatabase({
        databaseName: Env.SQLITE_DB_NAME,
      });
      showErrorMessage('Error setting up database, switching to local database');
      return;
    }
    console.log('error setting up database', e);
    throw e;
  }
};
