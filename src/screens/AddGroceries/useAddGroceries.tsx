import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { useCallback, useEffect, useState } from 'react';
import { createMultipleReminders } from '@/utils/reminderUtils';
import { showErrorMessage } from '@/utils/promptUtils';
import useGetRecipeIngredients from '@/database/api/recipes/hooks/useGetRecipeIngredients';
import { RouteProp } from '@/navigation/types';
import { useBoundStore } from '@/store';
import { parseMetrics, scaleAmount } from '@/utils/ingredientsUtil';
import { getRecipeServings } from '@/database/api/recipes';
import { translate } from '@/core';

const useAddGroceries = () => {
  const route = useRoute<RouteProp<Routes.AddGroceries>>();
  const { id } = route.params;

  const { ingredients: data } = useGetRecipeIngredients(id) || {};

  const { navigate } = useNavigation();
  const currentServings = useBoundStore((state) => state.currentServings);
  const recipeUnit = useBoundStore((state) => state.currentRecipeUnit);

  const getParsedIngredients = useCallback(async () => {
    const ingredients = data || [];
    const initialServing = await getRecipeServings(id);
    return ingredients.map((ingredient) => {
      const nameWithoutParentheses = ingredient.text.replace(/\(.*?\)/g, '').trim();

      const { description, quantity, unitOfMeasure } = parseMetrics({
        note: nameWithoutParentheses,
        recipeUnit,
      });
      const amount = scaleAmount(quantity, currentServings, initialServing || 1);

      return {
        name: `${amount}${unitOfMeasure ? ` ${unitOfMeasure}` : ''} ${description}`,
        isSelected: true,
      };
    });
  }, [currentServings, data, id, recipeUnit]);

  const [ingredients, setIngredients] = useState<
    {
      name: string;
      isSelected: boolean;
    }[]
  >([]);

  useEffect(() => {
    const updateIngredients = async () => {
      const parsedIngredients = await getParsedIngredients();
      setIngredients(parsedIngredients);
    };
    updateIngredients();
  }, [getParsedIngredients]);

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
      showErrorMessage(translate('add_groceries.error_adding_groceries'));
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
