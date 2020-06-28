import { EventEmitter, Injectable } from '@angular/core'

import { Recipe } from './recipe.model'
import { Ingredient } from '../shared/ingredient.model'
import { ShoppingListService } from '../shopping-list/shopping-list.service'

@Injectable()
export class RecipeService {
	recipeSelected = new EventEmitter<Recipe>()

	private recipes: Recipe[] = [
		new Recipe(
			'Pizza',
			'Pepperoni Pizza',
			'https://www.simplyrecipes.com/wp-content/uploads/2019/09/easy-pepperoni-pizza-lead-4-768x1075.jpg',
			[
				new Ingredient('Meat', 1),
				new Ingredient('Cheese', 5),
				new Ingredient('Pepperonie', 15),
				new Ingredient('Dough', 3)
			]
		),
		new Recipe(
			'Pasta',
			'Mac and Cheese',
			'https://pinchofyum.com/wp-content/uploads/Best-Instant-Pot-Mac-and-Cheese.jpg',
			[
				new Ingredient('Noodles', 50),
				new Ingredient('Chedar Cheese', 2),
				new Ingredient('Milk', 1),
				new Ingredient('Flour', 1)
			]
		)
	]

	constructor(private shoppingListService: ShoppingListService) { }

	public getRecipes() {
		return this.recipes.slice()
	}

	public addIngredientsToShoppingList(ingredient: Ingredient[]) {
		this.shoppingListService.addIngredients(ingredient)
	}
}