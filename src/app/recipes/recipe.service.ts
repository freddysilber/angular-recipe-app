import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { Recipe } from './recipe.model'
import { Ingredient } from '../shared/ingredient.model'
import { ShoppingListService } from '../shopping-list/shopping-list.service'

@Injectable()
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>()

	constructor(private shoppingListService: ShoppingListService) { }

	private recipes: Recipe[] = []

	private refreshRecipes() {
		this.recipesChanged.next(this.getRecipes())
	}

	public setRecipes(recipes: Recipe[]) {
		this.recipes = recipes
		this.refreshRecipes()
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
		this.refreshRecipes()
	}

	public updateRecipe(index: number, newRecipe: Recipe) {
		this.recipes[index] = newRecipe
		this.refreshRecipes()
	}

	public deleteRecipe(index: number) {
		this.recipes.splice(index, 1)
		this.refreshRecipes()
	}
}