import { useCallback, useState } from 'react';
import { showErrorMessage } from '@/utils/promptUtils';
import { generateInvitation } from '@/services/invitations';
import { onShareVault } from '@/utils/shareUtils';

const useHandleInvite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onInviteToVault = useCallback(async (groupId: string, name: string) => {
    try {
      setIsLoading(true);

      const invitationCode = await generateInvitation({
        groupId,
        name,
      });

      await onShareVault(invitationCode || '');

      return true;
    } catch (error) {
      // @ts-ignore
      showErrorMessage(error?.message || 'Failed to create invitation.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    onInviteToVault,
    isLoading,
  };
};

export default useHandleInvite;
