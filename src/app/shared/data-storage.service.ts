import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { map, tap } from 'rxjs/operators'

import { Recipe } from '../recipes/recipe.model'
import { RecipeService } from '../recipes/recipe.service'
import * as fromApp from '../store/app.reducer'
import * as RecipesActions from '../recipes/store/recipe.actions'

const databaseApiUrl = 'https://angular-recipe-app-2cafb.firebaseio.com/recipes.json'

@Injectable({
	providedIn: 'root'
})
export class DataStorageService {

	constructor(
		private http: HttpClient,
		private recipeService: RecipeService,
		private store: Store<fromApp.AppState>
	) { }

	storeRecipes() {
		this.http.put(databaseApiUrl, this.recipeService.getRecipes()).subscribe()
	}

	fetchRecipes() {
		return this.http.get<Recipe[]>(databaseApiUrl)
			.pipe(
				map(recipes => {
					return recipes.map(recipe => {
						return {
							...recipe,
							ingredients: recipe.ingredients ? recipe.ingredients : []
						}
					})
				}),
				tap(recipes => this.store.dispatch(new RecipesActions.SetRecipes(recipes)))
			)
	}
}