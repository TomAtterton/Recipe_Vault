import { supabase } from '@/services';
import { randomUUID } from 'expo-crypto';

const MAX_GROUP_SIZE = 2;

export const createGroup = async ({ name, userId }: { name: string; userId?: string }) => {
  try {
    const id = randomUUID();
    const { error: groupError } = await supabase.from('groups').insert([
      {
        id,
        name,
        updated_at: new Date().toISOString(),
      },
    ]);

    const { error: profileGroupError } = await supabase.from('profile_groups').insert([
      {
        id: randomUUID(),
        profile_id: userId,
        group_id: id,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (groupError || profileGroupError) {
      throw new Error('Error creating group');
    }

    return id;
  } catch (e) {
    console.log('error creating group', e);
    throw e;
  }
};

export const createProfileGroup = async ({
  userId,
  groupId,
}: {
  userId?: string;
  groupId: string;
}) => {
  try {
    const { count, error: countError } = await supabase
      .from('profile_groups')
      .select('profile_id', { count: 'exact' })
      .eq('group_id', groupId);

    if (countError) {
      throw new Error(`Failed to count users in group ${groupId}: ${countError.message}`);
    }

    if ((count || 0) >= MAX_GROUP_SIZE) {
      throw new Error('This group already has two members');
    }

    const { error } = await supabase.from('profile_groups').insert([
      {
        id: randomUUID(),
        profile_id: userId,
        group_id: groupId,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (e) {
    console.log('error creating profile group', e);
    throw e;
  }
};
