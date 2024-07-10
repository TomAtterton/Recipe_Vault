import { useURL } from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Routes } from '@/navigation/Routes';

const useHandleShare = () => {
  const url = useURL();
  const navigation = useNavigation();

  useEffect(() => {
    if (!url) return;
    const prefix = 'recipeapp://share/?url=';
    const urlWithoutPrefix = url.replace(prefix, '');
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.RecipeWebview, params: { url: urlWithoutPrefix } }],
    });
  }, [navigation, url]);
};

export default useHandleShare;
