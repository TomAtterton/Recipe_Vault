import { insertProfile } from '@/database/api/profile/index';

const setProfileGroup = async ({ groupId, userId }: { groupId: string; userId?: string }) => {
  try {
    if (!userId) throw new Error('User id is required');
    await insertProfile({ userId: userId, groupId });
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
};
export default setProfileGroup;
