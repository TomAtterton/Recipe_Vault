import { supabase } from '@/services';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setSession } from '@/store';

const useHandleSession = () => {
  const { reset } = useNavigation();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [reset]);
};

export default useHandleSession;
