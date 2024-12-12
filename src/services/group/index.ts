import { supabase } from '@/services';
import { randomUUID } from 'expo-crypto';
import { useBoundStore } from '@/store';

/**
 *
 * @param name
 * @param userId
 */
export const onCreateGroup = async ({ name, userId }: { name: string; userId?: string }) => {
  try {
    const groupId = randomUUID();

    const updatedAt = new Date().toISOString();

    const hasPremium = useBoundStore.getState().hasPremium;

    const { error: groupError } = await supabase.from('groups').insert([
      {
        id: groupId,
        name,
        updated_at: updatedAt,
        created_by: userId,
        access_level: hasPremium ? 'premium' : 'free',
      },
    ]);

    const { error: profileGroupError } = await supabase.from('profile_groups').insert([
      {
        id: randomUUID(),
        profile_id: userId,
        group_id: groupId,
        group_role: 'admin',
        updated_at: updatedAt,
      },
    ]);

    if (groupError || profileGroupError) {
      console.log('error creating group', groupError, profileGroupError);
      throw new Error('Error creating group');
    }

    return groupId;
  } catch (e) {
    console.log('error creating group', e);
    throw e;
  }
};

export const onGetGroupName = async ({ groupId }: { groupId: string }) => {
  try {
    const { data: groupData } = await supabase.from('groups').select('name').eq('id', groupId);

    const response = groupData?.[0];
    const groupName = response?.name;

    return {
      groupName,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    return {};
  }
};

export const onDeleteGroup = async ({ groupId }: { groupId: string }) => {
  try {
    const { error: groupError } = await supabase.from('groups').delete().eq('id', groupId);

    if (groupError) {
      throw new Error('Error deleting group');
    }
  } catch (e) {
    throw e;
  }
};
