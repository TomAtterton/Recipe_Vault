import { sqlGet } from '@/database/sql';
import { SELECT_PROFILE } from '@/database/api/profile/index';

const getProfile = async (userId: string) => {
  try {
    const currentProfile: {
      profile_id: string;
      group_id: string;
      group_name: string;
    } | null = await sqlGet(SELECT_PROFILE, [userId]);

    return {
      userId: currentProfile?.profile_id,
      groupId: currentProfile?.group_id,
      groupName: currentProfile?.group_name,
    };
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
};
export default getProfile;
