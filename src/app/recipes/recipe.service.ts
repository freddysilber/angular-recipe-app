import { EventEmitter } from '@angular/core'

import { Recipe } from './recipe.model'

export class RecipeService {
	recipeSelected = new EventEmitter<Recipe>()

	private recipes: Recipe[] = [
		new Recipe('Pizza', 'Pepperoni Pizza', 'https://www.simplyrecipes.com/wp-content/uploads/2019/09/easy-pepperoni-pizza-lead-4-768x1075.jpg'),
		new Recipe('Pasta', 'Mac and Cheese', 'https://pinchofyum.com/wp-content/uploads/Best-Instant-Pot-Mac-and-Cheese.jpg')
	]

	public getRecipes() {
		return this.recipes.slice()
	}
}