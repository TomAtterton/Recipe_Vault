import { useEffect, useRef } from 'react';
import { parse } from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { getInitialURL, addEventListener } from 'expo-linking';
import { Routes } from '@/navigation/Routes';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import { useBoundStore } from '@/store';

// Parent Hook: Handles URL listening and delegates processing
const useHandleDeeplinking = () => {
  const handleInvitation = useHandleInvitation();
  const handleShare = useHandleShare();
  const hasProcessedInitialURLRef = useRef(false);

  useEffect(() => {
    const processUrl = (url: string) => {
      try {
        const { queryParams } = parse(url) || {};
        if (queryParams?.code) {
          handleInvitation(url);
        } else if (url.includes('recipeapp://share')) {
          handleShare(url);
        } else {
          console.warn('useHandleUrls - Unrecognized URL:', url);
        }
      } catch (error) {
        console.error('useHandleUrls - Error processing URL:', error);
      }
    };

    const handleInitialUrl = async () => {
      if (hasProcessedInitialURLRef.current) {
        return;
      }
      try {
        const initialUrl = await getInitialURL();
        if (initialUrl) {
          processUrl(initialUrl);
          hasProcessedInitialURLRef.current = true;
        }
      } catch (error) {
        console.error('useHandleUrls - Error retrieving initial URL:', error);
      }
    };

    handleInitialUrl();

    const subscription = addEventListener('url', (event: { url: string }) => {
      processUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleInvitation, handleShare]);
};

const useHandleInvitation = () => {
  const { navigate } = useNavigation();
  const isLoggedIn = useIsLoggedIn();
  const setInvitationCode = useBoundStore((state) => state.setInvitationCode);

  return (url: string) => {
    try {
      const { queryParams } = parse(url) || {};
      const code = queryParams?.code as string;

      if (code) {
        setInvitationCode(code as string);

        if (isLoggedIn) {
          navigate(Routes.JoinVault, { invitationCode: code });
        } else {
          navigate(Routes.Login, { showSkip: false, invitationCode: code });
        }
      } else {
        console.warn('useHandleInvitation - No invitation code in URL:', url);
      }
    } catch (error) {
      console.error('useHandleInvitation - Error processing invitation URL:', error);
    }
  };
};

const useHandleShare = () => {
  const navigation = useNavigation();

  return (url: string) => {
    const prefix = 'recipeapp://share/?url=';
    if (!url.startsWith(prefix)) {
      console.error('useHandleShare - URL does not match expected prefix:', url);
      return;
    }

    const urlWithoutPrefix = url.replace(prefix, '');
    console.log('useHandleShare - Navigating to RecipeWebview with URL:', urlWithoutPrefix);

    navigation.reset({
      index: 0,
      routes: [{ name: Routes.RecipeWebview, params: { url: urlWithoutPrefix } }],
    });
  };
};

export default useHandleDeeplinking;
