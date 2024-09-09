import { supabase } from '@/services';
import { useCallback, useEffect, useRef } from 'react';
import { setSession, useBoundStore } from '@/store';
import { Session } from '@supabase/supabase-js';
import { useNetInfo } from '@react-native-community/netinfo';
import { onDisconnect } from '@/services/auth';

const useHandleSession = () => {
  const { isConnected } = useNetInfo();
  const isDisconnectingRef = useRef(false);
  const currentAccessToken = useBoundStore((state) => state.session?.access_token);

  const handleSessionChange = useCallback(
    async (newSession: Session | null) => {
      if (!isConnected) return;

      const newAccessToken = newSession?.access_token;
      if (newAccessToken === currentAccessToken) return;

      if (!newSession) {
        if (currentAccessToken && !isDisconnectingRef.current) {
          isDisconnectingRef.current = true;
          try {
            await onDisconnect();
          } finally {
            isDisconnectingRef.current = false;
          }
        }
      } else {
        setSession(newSession);
      }
    },
    [currentAccessToken, isConnected],
  );

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      handleSessionChange(session);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSessionChange]);
};

export default useHandleSession;
