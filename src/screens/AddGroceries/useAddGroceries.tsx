import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@/navigation/types';
import { Routes } from '@/navigation/Routes';
import { useMemo, useState } from 'react';
import { createMultipleReminders } from '@/utils/reminderUtils';
import { showErrorMessage } from '@/utils/errorUtils';

const useAddGroceries = () => {
  const route = useRoute<RouteProp<Routes.AddGroceries>>();
  const params = route.params;

  const { navigate } = useNavigation();

  const initialIngredients = useMemo(() => {
    const ingredients = params?.ingredients || [];
    return ingredients
      .filter((ingredient) => ingredient.type !== 'section')
      .map((ingredient) => {
        const nameWithoutParentheses = ingredient.text.replace(/\(.*?\)/g, '').trim();
        return {
          name: nameWithoutParentheses,
          isSelected: true, // All ingredients are selected by default
        };
      });
  }, [params?.ingredients]);

  const [ingredients, setIngredients] = useState(initialIngredients);

  const toggleIngredientSelection = (index: number): void => {
    const newIngredients = ingredients.map((item, idx) => {
      if (idx === index) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });
    setIngredients(newIngredients);
  };

  const updateIngredientName = (index: number, newName: string): void => {
    const newIngredients = ingredients.map((item, idx) => {
      if (idx === index) {
        return { ...item, name: newName };
      }
      return item;
    });
    setIngredients(newIngredients);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const selectedIngredients = ingredients
        .filter((ingredient) => ingredient.isSelected)
        .map((ingredient) => ({
          title: ingredient.name,
        }));

      await createMultipleReminders(selectedIngredients);
      navigate(Routes.Groceries);
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding groceries', error);
      showErrorMessage('Error adding groceries');
      setIsLoading(false);
    }
  };

  return {
    ingredients,
    toggleIngredientSelection,
    updateIngredientName,
    setIngredients,
    handleSave,
    isLoading,
  };
};

export default useAddGroceries;
