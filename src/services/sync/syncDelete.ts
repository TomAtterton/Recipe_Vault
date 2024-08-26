import { useBoundStore } from '@/store';
import { database } from '@/database';
import { supabase } from '@/services';
import { getLastSynced } from '@/services/sync/utils';

export const syncDelete = async (lastSynced?: string): Promise<void> => {
  try {
    await onDeleteLocalTable(lastSynced);
    await onDeleteRemoteTable();
  } catch (e) {
    console.error('delete local table error', e);
    throw e;
  }
};

const onDeleteLocalTable = async (lastSynced?: string) => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  try {
    const last_updated_at = lastSynced ? lastSynced : getLastSynced();

    const groupId = useBoundStore.getState()?.profile?.groupId || '';

    const { data, error } = await supabase
      .from('deleted_records')
      .select('table_name, deleted_record_id')
      .gte('created_at', last_updated_at)
      .eq('group_id', groupId);

    if (error) {
      console.error('Fetching deleted supabase errors', error);
      throw error;
    }

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }

    await database.withExclusiveTransactionAsync(async (txn) => {
      for (const { table_name, deleted_record_id } of data) {
        await txn.runAsync(`DELETE FROM ${table_name} WHERE id = ?`, [deleted_record_id]);
      }
    });
  } catch (e) {
    console.error('Delete local records error:', e);
    throw e;
  }
};

const onDeleteRemoteTable = async () => {
  try {
    if (!database) {
      throw new Error('Database not initialized');
    }

    const deletedRecords = (await database.getAllAsync(
      `SELECT * FROM deleted_records WHERE is_modified = 1`
    )) as any[];

    if (deletedRecords && deletedRecords.length === 0) {
      return;
    }

    // We need to remove the additional property `is_modified` from the local database before we upsert the records to the remote database
    const modifiedRecords = deletedRecords.map((record) => {
      delete record?.is_modified;
      return record;
    });

    for (const record of modifiedRecords) {
      const deletedRecordId = record?.deleted_record_id;

      // We add the deleted record to the remote database so other users can see that it has been deleted
      const { error: deleteRecordError } = await supabase
        .from('deleted_records')
        .upsert(modifiedRecords);

      // Then we delete the record from the remote database table
      const { error: deleteTableError } = await supabase
        .from(record.table_name)
        .delete()
        .eq('id', deletedRecordId);

      if (deleteTableError || deleteRecordError) {
        throw deleteTableError || deleteRecordError;
      }
      // Then we delete the record from the local database
      await database.runAsync(`DELETE FROM deleted_records WHERE id = ?`, [record.id]);
    }
  } catch (error) {
    console.log('Error handling delete remote table', error);
    throw error;
  }
};
