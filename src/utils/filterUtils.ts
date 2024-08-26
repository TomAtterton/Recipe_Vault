export type FilterObjectType = {
  hasNotRated: boolean;
  rating: number | null;
  tags: string[];
};

export const generateFilterSelect = (
  categoriesIds: string[],
  filter: FilterObjectType,
  searchText: string | null // Add a searchText parameter to the filter
) => {
  const { rating, tags } = filter;

  let joins = [];
  let conditions = [];

  if (searchText) {
    // Join with recipe_instructions and recipe_ingredients
    joins.push('LEFT JOIN recipe_instructions ON recipes.id = recipe_instructions.recipe_id');
    joins.push('LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id');

    // Prepare the search condition for multiple fields using LOWER for case-insensitive search
    let searchConditions = [
      `LOWER(recipes.name) LIKE LOWER('%${searchText}%')`,
      `LOWER(recipes.description) LIKE LOWER('%${searchText}%')`,
      `LOWER(recipe_instructions.text) LIKE LOWER('%${searchText}%')`,
      `LOWER(recipe_ingredients.text) LIKE LOWER('%${searchText}%')`,
    ];

    // Add the OR combined search conditions to the main conditions
    conditions.push(`(${searchConditions.join(' OR ')})`);
  }

  // Handle category filter
  if (categoriesIds.length) {
    joins.push('JOIN recipe_categories ON recipes.id = recipe_categories.recipe_id');
    conditions.push(`recipe_categories.category_id IN ('${categoriesIds.join("','")}')`);
  }

  if (filter.hasNotRated) {
    conditions.push('recipes.rating = 0');
  } else {
    // Handle rating filter
    if (rating !== null) {
      conditions.push(`recipes.rating = ${rating}`);
    }
  }

  // Handle tags filter
  if (tags.length) {
    joins.push('JOIN recipe_tags ON recipes.id = recipe_tags.recipe_id');
    conditions.push(`recipe_tags.tag_id IN ('${tags.join("','")}')`);
  }

  // Build the JOIN and WHERE clauses
  let joinClause = joins.length ? joins.join(' ') : '';
  let whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  return (
    'SELECT DISTINCT recipes.id, recipes.name, recipes.description, recipes.rating, recipes.servings, ' +
    'recipes.cook_time, recipes.prep_time, recipes.image, recipes.last_made FROM recipes ' +
    joinClause +
    ' ' +
    whereClause
  );
};
