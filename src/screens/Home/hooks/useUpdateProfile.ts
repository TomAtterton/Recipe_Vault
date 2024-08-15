import { updateProfile, useBoundStore } from '@/store';
import { useEffect } from 'react';
import getProfile from '@/database/api/profile/getProfile';
import { Env } from '@/core/env';
import { showErrorMessage } from '@/utils/promptUtils';
import useUserId from '@/hooks/common/useUserId';

const useUpdateProfile = () => {
  const userId = useUserId();
  const groupId = useBoundStore((state) => state.profile.groupId);

  useEffect(() => {
    if (!groupId && userId) {
      getProfile(userId)
        .then((profileData) => {
          updateProfile({
            groupId: profileData?.groupId || Env.TEST_GROUP_ID,
            groupName: profileData?.groupName || Env.SQLITE_DB_NAME,
          });
        })
        .catch((e) => {
          showErrorMessage(e?.message || 'Error');
          console.log('e', e);
        });
    }
  }, [groupId, userId]);

  return {};
};

export default useUpdateProfile;
