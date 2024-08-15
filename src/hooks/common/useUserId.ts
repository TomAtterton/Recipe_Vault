import { useBoundStore } from '@/store';

const useUserId = () => {
  const userId = useBoundStore((state) => state.session?.user?.id);
  const localUserId = useBoundStore((state) => state.profile?.id);
  return userId || localUserId;
};

export const getUserId = () => {
  const userId = useBoundStore.getState().session?.user.id;
  const localId = useBoundStore.getState().profile.id;
  return userId || localId;
};

export default useUserId;
