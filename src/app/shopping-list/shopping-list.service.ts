import { Ingredient } from '../shared/ingredient.model'
import { EventEmitter } from '@angular/core'

export class ShoppingListService {
	ingredientsChanges = new EventEmitter<Ingredient[]>()

	private ingredients: Ingredient[] = [
		new Ingredient('Apples', 10),
		new Ingredient('Oranges', 5)
	]

	public getIngredients() {
		return this.ingredients.slice()
	}

	public addIngredient(ingredient: Ingredient) {
		this.ingredients.push(ingredient)
		this.ingredientsChanges.emit(this.ingredients.slice())
	}
}