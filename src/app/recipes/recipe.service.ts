import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Store } from '@ngrx/store'

import { Recipe } from './recipe.model'
import { Ingredient } from '../shared/ingredient.model'
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'

@Injectable()
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>()

	constructor(private store: Store<fromShoppingList.AppState>) { }

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

	public addIngredientsToShoppingList(ingredients: Ingredient[]) {
		this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
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