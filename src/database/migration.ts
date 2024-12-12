import { database } from '@/database';
import { supabase } from '@/services';
import { getUserId } from '@/hooks/common/useUserId';
import { useBoundStore } from '@/store';

export const TABLE_NAMES = [
  'profile',
  'groups',
  'profile_groups',
  'tags',
  'categories',
  'recipes',
  'recipe_instructions',
  'recipe_categories',
  'recipe_ingredients',
  'recipe_tags',
  'mealplans',
] as const;

interface GenericRecord {
  id: string;

  [key: string]: any;
}

export const migrateLocalDataToSupabase = async (vaultName: string) => {
  if (!database) {
    throw new Error('Database not initialized');
  }

  console.log('Starting data migration to Supabase for vault:', vaultName);

  // Get userId from Zustand store
  const profileId = getUserId();
  console.log('Profile ID:', profileId);

  const hasPremium = useBoundStore.getState().hasPremium;
  console.log('Has Premium:', hasPremium);

  // Step 3: Create a new group in Supabase
  console.log('Creating a new group in Supabase...');
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .insert([
      {
        name: vaultName,
        created_by: profileId,
        access_level: hasPremium ? 'premium' : 'free',
      },
    ])
    .select();

  if (groupError || !groupData || groupData.length === 0) {
    console.error('Error creating group in Supabase:', groupError);
    throw groupError;
  } else {
    console.log('Group created in Supabase:', groupData[0]);
  }

  const newGroupId = groupData[0].id;

  // Step 4: Link profile to the new group
  console.log('Linking profile to the new group in Supabase...');
  const { error: pgError } = await supabase
    .from('profile_groups')
    .insert([{ profile_id: profileId, group_id: newGroupId, group_role: 'owner' }]);

  if (pgError) {
    console.error('Error creating profile_groups in Supabase:', pgError);
    throw pgError;
  } else {
    console.log('Profile linked to group successfully.');
  }

  // Step 5: Migrate data for each table
  for (const tableName of TABLE_NAMES) {
    if (['deleted_records', 'profile', 'profile_groups', 'groups'].includes(tableName)) {
      // Skip these tables as they have been handled
      continue;
    }

    console.log(`Processing table: ${tableName}`);

    const records: GenericRecord[] = await database.getAllAsync(`SELECT * FROM ${tableName}`);

    console.log(`Fetched ${records.length} records from table ${tableName}`);

    if (records && records.length > 0) {
      // Modify records
      const modifiedRecords = records.map((record) => {
        const modifiedRecord = { ...record };

        if ('group_id' in modifiedRecord) {
          modifiedRecord.group_id = newGroupId;
        }

        if (tableName === 'recipes' && 'user_id' in modifiedRecord) {
          modifiedRecord.user_id = profileId;
        }

        delete modifiedRecord.is_modified; // Remove is_modified flag if present

        return modifiedRecord;
      });

      console.log(`Modified ${modifiedRecords.length} records for table ${tableName}`);

      // Step 6: Push modified records to Supabase
      try {
        console.log(
          `Upserting ${modifiedRecords.length} records to table ${tableName} in Supabase...`,
        );
        const { error } = await supabase.from(tableName).upsert(modifiedRecords);

        if (error) {
          console.error(`Error upserting records to table ${tableName}:`, error);
          throw error;
        } else {
          console.log(`Upserted records to table ${tableName} successfully.`);
        }
      } catch (error) {
        console.error(`Error pushing data for table ${tableName}:`, error);
        throw error;
      }
    } else {
      console.log(`No records to migrate for table ${tableName}.`);
    }
  }

  return newGroupId;
};
