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
        group_role: 'admin',
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
        group_role: 'read_write',
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

export const getProfileGroup = async ({ userId }: { userId?: string | null }) => {
  try {
    const { data: profileData } = await supabase
      .from('profile_groups')
      .select('id, group_id, group_role, groups(name)')
      .eq('profile_id', userId || '');

    const response = profileData?.[0];
    const groupId = response?.group_id;
    const groupName = response?.groups?.name;
    const groupRole = response?.group_role;

    return {
      groupId,
      groupName,
      groupRole,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    return {};
  }
};

export const getProfileGroupByGroupId = async ({ groupId }: { groupId: string }) => {
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
