import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { map, switchMap } from 'rxjs/operators'

import { Recipe } from '../recipe.model'
import { RecipeService } from '../recipe.service'
import { Store } from '@ngrx/store'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe
  id: number

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.route.params.pipe(map(params => {
      return +params['id']
    }), switchMap(id => {
      return this.store.select('recipes')
    })).subscribe((params: Params) => {
      this.id = +params['id']
        .pipe(
          map(recipesState => {
            return recipesState.recipes.find((recipe, index) => {
              return index === this.id
            })
          })
        ).subscribe(recipe => this.recipe = recipe)
      // this.recipe = this.recipeService.getRecipe(this.id)
    })
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }

  onEditRecipe() { // Both of these nagivations are correct
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id)
    this.router.navigate(['/recipes'])
  }
}