import { Injectable } from '@angular/core'

import { Recipe } from './recipe.model'
import { Ingredient } from '../shared/ingredient.model'
import { ShoppingListService } from '../shopping-list/shopping-list.service'
import { Subject } from 'rxjs'

@Injectable()
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>()

	constructor(private shoppingListService: ShoppingListService) { }

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

	private refreshRecipes() {
		this.recipesChanged.next(this.recipes.slice())
	}

	public getRecipes() {
		return this.recipes.slice()
	}

	public getRecipe(index: number) {
		return this.recipes[index]
	}

	public addIngredientsToShoppingList(ingredient: Ingredient[]) {
		this.shoppingListService.addIngredients(ingredient)
	}

	public addRecipe(recipe: Recipe) {
		this.recipes.push(recipe)
		// this.recipesChanged.next(this.recipes.slice())
		this.refreshRecipes()
	}

	public updateRecipe(index: number, newRecipe: Recipe) {
		this.recipes[index] = newRecipe
		// this.recipesChanged.next(this.recipes.slice())
		this.refreshRecipes()
	}
}