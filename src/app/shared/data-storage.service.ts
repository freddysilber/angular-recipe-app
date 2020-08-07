import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, tap } from 'rxjs/operators'

import { RecipeService } from '../recipes/recipe.service'
import { Recipe } from '../recipes/recipe.model'

@Injectable({
	providedIn: 'root'
})
export class DataStorageService {
	apiUrl: string = 'https://angular-recipe-app-2cafb.firebaseio.com/recipes.json'

	constructor(
		private http: HttpClient,
		private recipeService: RecipeService
	) { }

	storeRecipes() {
		this.http.put(this.apiUrl, this.recipeService.getRecipes()).subscribe(response => console.log(response))
	}

	fetchRecipes() {
		return this.http.get<Recipe[]>(this.apiUrl).pipe(map(recipes => {
			return recipes.map(recipe => {
				return {
					...recipe,
					ingredients: recipe.ingredients ? recipe.ingredients : []
				}
			})
		}), tap(recipes => this.recipeService.setRecipes(recipes)))
	}
}