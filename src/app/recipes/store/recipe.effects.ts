import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { switchMap, map } from 'rxjs/operators'

import * as RecipesActions from './recipe.actions'
import { Recipe } from '../recipe.model'

const databaseApiUrl = 'https://angular-recipe-app-2cafb.firebaseio.com/recipes.json'

@Injectable()
export class RecipeEffects {
	@Effect()
	fetchRecipes = this.actions$.pipe(
		ofType(RecipesActions.FETCH_RECIPES),
		switchMap(() => this.http.get<Recipe[]>(databaseApiUrl)),
		map(recipes => {
			return recipes.map(recipe => {
				return {
					...recipe,
					ingredients: recipe.ingredients ? recipe.ingredients : []
				}
			})
		}),
		map(recipes => new RecipesActions.SetRecipes(recipes))
	)

	constructor(
		private actions$: Actions,
		private http: HttpClient
	) { }
}