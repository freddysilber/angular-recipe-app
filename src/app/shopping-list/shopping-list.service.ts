import { Subject } from 'rxjs'
import { Ingredient } from '../shared/ingredient.model'

export class ShoppingListService {
	ingredientsChanges = new Subject<Ingredient[]>()
	startedEditing = new Subject<number>()

	private ingredients: Ingredient[] = [
		new Ingredient('Apples', 10),
		new Ingredient('Oranges', 5)
	]

	public getIngredients() {
		return this.ingredients.slice()
	}

	public getIngredient(index: number) {
		return this.ingredients[index]
	}

	public updateIngredient(index: number, newIngredient: Ingredient) {
		this.ingredients[index] = newIngredient
		this.ingredientsChanges.next(this.ingredients.slice())
	}

	public addIngredient(ingredient: Ingredient) {
		this.ingredients.push(ingredient)
		this.ingredientsChanges.next(this.ingredients.slice())
	}

	public addIngredients(ingredients: Ingredient[]) {
		this.ingredients.push(...ingredients)
		this.ingredientsChanges.next(this.ingredients.slice())
	}
}