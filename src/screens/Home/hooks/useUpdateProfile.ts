import { updateProfile, useBoundStore } from '@/store';
import { useEffect } from 'react';
import getProfile from '@/database/api/profile/getProfile';
import { Env } from '@/core/env';
import { showErrorMessage } from '@/utils/promptUtils';

const useUpdateProfile = () => {
  const userId = useBoundStore((state) => state.profile.id);
  const groupId = useBoundStore((state) => state.profile.groupId);

  useEffect(() => {
    if (!groupId && userId) {
      getProfile(userId)
        .then((profileData) => {
          updateProfile({
            groupId: profileData?.groupId || Env.TEST_GROUP_ID,
            groupName: profileData?.groupName || 'Default Vault',
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
