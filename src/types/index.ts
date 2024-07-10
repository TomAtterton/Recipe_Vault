export type Category = {
  id: string;
  name?: string | null;
  group_id?: string | null;
};
export type Tag = {
  id: string;
  name?: string | null;
  group_id?: string | null;
};

export type Ingredient = {
  title?: string | null;
  id: string;
  text: string;
  // isEditing: boolean;
  // TODO fix this weird naming
  type?: 'section' | 'ingredient'; // Add the type property to Ingredient type
};

export type Instruction = {
  title?: string | null;
  id: string;
  text: string;
  // isEditing?: boolean;
  // TODO fix this weird naming
  type?: 'section' | 'ingredient'; // Add the type property to Ingredient type
};

export type RecipeDetailType = {
  id: string;
  userId: string;
  name: string;
  description: string;
  rating?: number | null;
  dateAdded?: string | null;
  dateUpdated?: string | null;
  image?: string | null;
  note?: string | null;
  lastMade?: string | null;
  source?: string | null;
  performTime?: string | null;
  prepTime?: string | null;
  servings?: number | null;
  recipeTags?: Tag[];
  recipeCategory?: Category[];
  recipeIngredient?: Ingredient[];
  recipeInstructions?: Instruction[];
};
