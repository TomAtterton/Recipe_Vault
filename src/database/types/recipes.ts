export interface RecipeDetails {
  recipe_id: string;
  group_id: string | null;
  user_id: string | null;
  name: string;
  description: string;
  imageUrl: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  rating: number;
  source: string;
  note: string;
  last_made: Date | null;
}
