import { Ingredient } from '../shared/ingredient.model'

export class ShoppingListService {
	private ingredients: Ingredient[] = [
		new Ingredient('Apples', 10),
		new Ingredient('Oranges', 5)
	]

	public getIngredients() {
		return this.ingredients.slice()
	}

	// public addIngredient(){

	// }
}