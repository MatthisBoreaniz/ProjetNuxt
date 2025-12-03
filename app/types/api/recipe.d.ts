type Recipe = {
  recipe_id: number;
  title: string;
  description: string;
  image_url: string;
  cuisine_name: Cuisine['name'];
  goal_name: Goal['name'];
  diet_name: Diet['name'];
  allergy_name: Allergy['name'];
}

type RecipeIngredients = {
  ingredient_id: number;
  quantity: string;
  unit: string;
  name: string;
}

type RecipeInstructions = {
  instruction_id: number;
  step_number: number;
  description: string;
}

type FullRecipe = Recipe & {
  ingredients: RecipeIngredients[];
  instructions: RecipeInstructions[];
}
