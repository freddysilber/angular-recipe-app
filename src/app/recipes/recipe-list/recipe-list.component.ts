import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { Recipe } from '../recipe.model'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>()
  recipes: Recipe[] = [
    new Recipe('Pizza', 'pizza is dank', 'https://www.simplyrecipes.com/wp-content/uploads/2019/09/easy-pepperoni-pizza-lead-4-768x1075.jpg'),
    new Recipe('Pasta', 'I like cheese', 'https://www.simplyrecipes.com/wp-content/uploads/2019/09/easy-pepperoni-pizza-lead-4-768x1075.jpg')
  ]

  constructor() {

  }

  ngOnInit() {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe)
  }

}
