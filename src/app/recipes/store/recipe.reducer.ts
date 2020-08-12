import { Recipe } from '../recipe.model'
import * as RecipesActions from './recipe.actions'
import { act } from '@ngrx/effects'

const initialState: State = {
	recipes: []
}

export interface State {
	recipes: Recipe[]
}

export function recipeReducer(state: State = initialState, action: RecipesActions.RecipesActions) {
	switch (action.type) {
		case RecipesActions.SET_RECIPES:
			return {
				...state,
				recipes: [...action.payload]
			}
		case RecipesActions.FETCH_RECIPES:
			return {
				...state
			}
		case RecipesActions.ADD_RECIPE:
			return {
				...state,
				recipes: [...state.recipes, action.payload]
			}
		case RecipesActions.UPDATE_RECIPE:
			const updatedRecipe = {
				...state.recipes[action.payload.index],
				...action.payload.newRecipe
			}
			const updatedRecipes = [...state.recipes]
			updatedRecipes[action.payload.index] = updatedRecipe
			return {
				...state,
				recipes: updatedRecipes
			}
		case RecipesActions.DELETE_RECIPE:
			return {
				...state,
				recipes: state.recipes.filter((recipe, index) => index !== action.payload)
			}
		default:
			return state
	}
}