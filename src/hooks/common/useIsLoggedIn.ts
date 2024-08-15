import { useBoundStore } from '@/store';

const useIsLoggedIn = () => {
  const userId = useBoundStore((state) => state.session?.user.id);

  return !!userId;
};

export default useIsLoggedIn;
