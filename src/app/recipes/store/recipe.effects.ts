import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { switchMap, map, withLatestFrom } from 'rxjs/operators'

import * as RecipesActions from './recipe.actions'
import { Recipe } from '../recipe.model'
import * as fromApp from '../../store/app.reducer'

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

	@Effect({ dispatch: false })
	storeRecipes = this.actions$.pipe(
		ofType(RecipesActions.STORE_RECIPES),
		withLatestFrom(this.store.select('recipes')),
		switchMap(([actionData, recipesState]) => this.http.put(databaseApiUrl, recipesState.recipes))
	)

	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private store: Store<fromApp.AppState>
	) { }
}