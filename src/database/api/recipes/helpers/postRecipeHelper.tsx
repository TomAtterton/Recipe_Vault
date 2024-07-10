import { RecipeDetailType } from '@/database/api/recipes/hooks/usePostUpdateRecipes';

export interface Ingredient {
  section_title: string;
  text: string;
  id: string;
}

export interface Instruction {
  section_title: string;
  text: string;
  id: string;
}

export interface Category {
  category_id: string;
}

export interface Tag {
  tag_id: string;
}

export const checkMetaDataDuplicates = (
  data: Partial<RecipeDetailType>,
  previousData?: Partial<RecipeDetailType>
) => {
  // Function to compare arrays for any kind of change, including reordering
  const hasAnyChanges = (currentItems: any[], prevItems: any[], comparisonFields: string[]) => {
    if (currentItems.length !== prevItems.length) return true; // Different sizes mean changes
    for (let i = 0; i < currentItems.length; i++) {
      const currentItem = currentItems[i];
      const prevItem = prevItems[i];
      // Check if the IDs match to detect reordering, then check each field for changes
      if (
        currentItem.id !== prevItem.id ||
        comparisonFields.some((field) => {
          if (!prevItem[field] && !currentItem[field]) return false;
          return currentItem[field] !== prevItem[field];
        })
      ) {
        return true;
      }
    }
    return false;
  };

  // Apply comparison for each category
  const ingredientsChanged = hasAnyChanges(
    data?.recipeIngredient || [],
    previousData?.recipeIngredient || [],
    ['title', 'text']
  );
  const instructionsChanged = hasAnyChanges(
    data?.recipeInstructions || [],
    previousData?.recipeInstructions || [],
    ['title', 'text']
  );
  const categoriesChanged = hasAnyChanges(
    data?.recipeCategory || [],
    previousData?.recipeCategory || [],
    ['name']
  );
  const tagsChanged = hasAnyChanges(data?.recipeTags || [], previousData?.recipeTags || [], [
    'name',
  ]);

  const transformRecipeIngredient = data?.recipeIngredient?.map((item) => {
    return {
      section_title: item.title,
      text: item.text,
      id: item.id,
    };
  }) as Ingredient[];

  const transformRecipeInstructions = data?.recipeInstructions?.map((item) => {
    return {
      section_title: item.title,
      text: item.text,
      id: item.id,
    };
  }) as Instruction[];

  const transformRecipeCategory = data?.recipeCategory?.map((item) => {
    return {
      category_id: item.id,
    };
  }) as Category[];

  const transformRecipeTags = data?.recipeTags?.map((item) => {
    return {
      tag_id: item.id,
    };
  }) as Tag[];

  return {
    ingredients: ingredientsChanged ? transformRecipeIngredient : [],
    instructions: instructionsChanged ? transformRecipeInstructions : [],
    categories: categoriesChanged ? transformRecipeCategory : [],
    tags: tagsChanged ? transformRecipeTags : [],
  };
};
