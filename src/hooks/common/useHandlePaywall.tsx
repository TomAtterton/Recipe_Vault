import { checkCanAddRecipe } from '@/services/pro';
import { useBoundStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';

const useHandlePaywall = () => {
  const isSyncEnabled = useBoundStore((state) => state.shouldSync);
  const { navigate } = useNavigation();
  const onCanAddRecipe = async () => {
    if (!isSyncEnabled) {
      return true;
    }

    const canAddRecipe = await checkCanAddRecipe();

    if (!canAddRecipe) {
      navigate(Routes.ProPlan);
      throw new Error('Cloud sync is enabled and you have reached the maximum recipe limit.');
    }

    return canAddRecipe;
  };

  return {
    onCanAddRecipe,
  };
};

export default useHandlePaywall;
