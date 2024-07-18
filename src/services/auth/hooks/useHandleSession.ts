import { supabase } from '@/services';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setSession, useBoundStore } from '@/store';

const useHandleSession = () => {
  const { reset } = useNavigation();
  const shouldSync = useBoundStore((state) => state.shouldSync);
  useEffect(() => {
    if (shouldSync) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }
  }, [reset, shouldSync]);
};

export default useHandleSession;
