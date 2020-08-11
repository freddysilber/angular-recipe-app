import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, tap } from 'rxjs/operators'

import { RecipeService } from '../recipes/recipe.service'
import { Recipe } from '../recipes/recipe.model'

const databaseApiUrl = 'https://angular-recipe-app-2cafb.firebaseio.com/recipes.json'

@Injectable({
	providedIn: 'root'
})
export class DataStorageService {

	constructor(
		private http: HttpClient,
		private recipeService: RecipeService
	) { }

	storeRecipes() {
		this.http
			.put(databaseApiUrl, this.recipeService.getRecipes())
			.subscribe(response => console.log(response))
	}

	fetchRecipes() {
		return this.http.get<Recipe[]>(databaseApiUrl).pipe(map(recipes => {
			return recipes.map(recipe => {
				return {
					...recipe,
					ingredients: recipe.ingredients ? recipe.ingredients : []
				}
			})
		}), tap(recipes => this.recipeService.setRecipes(recipes)))
	}
}