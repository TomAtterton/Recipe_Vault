import { supabase } from '@/database/supabase';
import { RecipeDetailType } from '@/types';

// TODO - can this be done locally or optimized ?
const useParseRecipeUrl = () => {
  const onParseRecipe = async (url: string): Promise<Partial<RecipeDetailType>> => {
    // TODO this won't work unless synced
    const response = await supabase.functions.invoke('recipe-parser', {
      body: {
        url,
      },
    });

    if (response.error) throw new Error(response.error.message);

    return {
      name: response?.data?.name,
      image: response.data?.image,
      description: response.data?.description,
      performTime: response.data?.cookTime,
      prepTime: response.data?.prepTime,
      servings: response.data?.recipeYield ? parseInt(response.data?.recipeYield) : 1,
      recipeIngredient:
        response.data?.recipeIngredients.map((_: any) => {
          return {
            text: _,
          };
        }) || [],
      recipeInstructions: response.data?.recipeInstructions.map((_: any) => {
        return {
          text: _,
        };
      }),
      source: url,
    };
  };
  return { onParseRecipe };
};

export default useParseRecipeUrl;
