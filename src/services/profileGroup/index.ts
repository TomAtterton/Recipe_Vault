import { supabase } from '@/services';
import { randomUUID } from 'expo-crypto';

const MAX_GROUP_SIZE = 3;

const checkProfileGroupSize = async ({ groupId }: { groupId: string }) => {
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
  } catch (e) {
    console.log('error checking profile group size', e);
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
    await checkProfileGroupSize({ groupId });

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
    const profileData = await getProfileGroups({ userId });

    const response = profileData?.[0];
    const groupId = response?.group_id;
    const groupName = response?.groups?.name;
    const groupRole = response?.group_role;

    return {
      groupId,
      groupName,
      groupRole,
      profileName: response?.profile?.name,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    return {};
  }
};

export const getProfileGroupWithUserId = async ({
  userId,
  groupId,
}: {
  userId?: string | null;
  groupId: string;
}) => {
  try {
    const profileData = await getProfileGroups({ userId });

    const response = profileData?.find((group) => group.group_id === groupId);
    const groupName = response?.groups?.name;
    const groupRole = response?.group_role;

    return {
      groupName,
      groupRole,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    return {};
  }
};

export const getProfileGroups = async ({ userId }: { userId?: string | null }) => {
  try {
    // Fetch profile groups related to the user
    const { data: profileDataResponse, error: profileError } = await supabase
      .from('profile_groups')
      .select('id, group_id, group_role, groups(name), profile(name)')
      .eq('profile_id', userId || '');

    if (profileError) {
      throw new Error(`Error fetching profile groups: ${profileError.message}`);
    }

    if (!profileDataResponse || profileDataResponse.length === 0) {
      return [];
    }

    // Extract all group IDs
    const groupIds = profileDataResponse.map((profileGroup) => profileGroup.group_id);

    // Fetch all created_by values for the group IDs
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('id, created_by')
      .in('id', groupIds);

    if (groupsError) {
      throw new Error(`Error fetching groups: ${groupsError.message}`);
    }

    // Map group_id to created_by
    const createdByMap = groups?.reduce(
      (acc, group) => {
        acc[group?.id] = group.created_by;
        return acc;
      },
      {} as Record<string, string | null>,
    );

    // Return the profile groups with the associated created_by information
    const result = profileDataResponse.map((profileGroup) => ({
      ...profileGroup,
      created_by: profileGroup?.group_id ? createdByMap?.[profileGroup?.group_id] || false : false,
    }));

    return result;
  } catch (e) {
    console.error('Error getting group data', e);
    return [];
  }
};

export const getProfileGroupsWithId = async ({ groupId }: { groupId?: string | null }) => {
  try {
    const { data: profileData } = await supabase
      .from('profile_groups')
      .select('id, group_id, group_role, groups(name), profile(name, id)')
      .eq('group_id', groupId || '');

    const data =
      profileData?.map((item) => ({
        id: item?.profile?.id,
        groupName: item?.groups?.name,
        groupRole: item?.group_role || 'read_write',
        name: item?.profile?.name,
      })) || [];

    return {
      groupName: data[0]?.groupName || '',
      data,
    };
  } catch (e) {
    console.log('Error getting group data', e);
    throw e;
  }
};

export const onDeleteProfileGroup = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) => {
  try {
    const { error: groupError } = await supabase
      .from('profile_groups')
      .delete()
      .eq('profile_id', userId)
      .eq('group_id', groupId);

    if (groupError) {
      throw new Error('Error deleting group');
    }
  } catch (e) {
    throw e;
  }
};
