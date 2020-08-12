import { Recipe } from '../recipe.model'
import * as RecipesActions from './recipe.actions'

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
		default:
			return state
	}
}