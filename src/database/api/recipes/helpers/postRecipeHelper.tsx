import { RecipeDetailType } from '@/types';

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
  data: RecipeDetailType,
  previousData?: RecipeDetailType | null,
) => {
  // Function to compare arrays for any kind of change, including reordering and deletion
  const compareAndFindChanges = (
    currentItems: any[],
    prevItems: any[],
    comparisonFields: string[],
  ) => {
    const addedOrChanged = [];
    const deleted = [];

    const prevItemsMap = new Map(prevItems.map((item) => [item.id, item]));

    currentItems.forEach((currentItem, index) => {
      const prevItem = prevItemsMap.get(currentItem.id);

      if (!prevItem) {
        addedOrChanged.push(currentItem); // New item added
        return;
      }

      // Check if any field has changed
      const hasChanged = comparisonFields.some((field) => {
        if (!prevItem[field] && !currentItem[field]) return false;
        return currentItem[field] !== prevItem[field];
      });

      // Check if the item has moved to a different position
      const hasReordered = prevItems.indexOf(prevItem) !== index;

      if (hasChanged || hasReordered) {
        addedOrChanged.push(currentItem); // Item exists but has changed or reordered
      }

      prevItemsMap.delete(currentItem.id); // Remove processed item from the map
    });

    // Items left in prevItemsMap were deleted
    for (const prevItem of prevItemsMap.values()) {
      deleted.push(prevItem);
    }

    // Return the new order if any changes, otherwise return an empty array
    const result = addedOrChanged.length > 0 || deleted.length > 0 ? currentItems : [];

    return { changed: result, deleted };
  };

  // Apply comparison for each category
  const ingredientsComparison = compareAndFindChanges(
    data?.recipeIngredient || [],
    previousData?.recipeIngredient || [],
    ['title', 'text'],
  );
  const instructionsComparison = compareAndFindChanges(
    data?.recipeInstructions || [],
    previousData?.recipeInstructions || [],
    ['title', 'text'],
  );
  const categoriesComparison = compareAndFindChanges(
    data?.recipeCategory || [],
    previousData?.recipeCategory || [],
    ['name'],
  );
  const tagsComparison = compareAndFindChanges(
    data?.recipeTags || [],
    previousData?.recipeTags || [],
    ['name'],
  );

  const transformRecipeIngredient = ingredientsComparison.changed.map((item) => ({
    section_title: item.title,
    text: item.text,
    id: item.id,
  })) as Ingredient[];

  const transformRecipeInstructions = instructionsComparison.changed.map((item) => ({
    section_title: item.title,
    text: item.text,
    id: item.id,
  })) as Instruction[];

  const transformRecipeCategory = categoriesComparison.changed.map((item) => ({
    category_id: item.id,
  })) as Category[];

  const transformRecipeTags = tagsComparison.changed.map((item) => ({
    tag_id: item.id,
  })) as Tag[];

  return {
    ingredients: {
      changed: transformRecipeIngredient,
      deleted: ingredientsComparison.deleted,
    },
    instructions: {
      changed: transformRecipeInstructions,
      deleted: instructionsComparison.deleted,
    },
    categories: {
      changed: transformRecipeCategory,
      deleted: categoriesComparison.deleted,
    },
    tags: {
      changed: transformRecipeTags,
      deleted: tagsComparison.deleted,
    },
  };
};
