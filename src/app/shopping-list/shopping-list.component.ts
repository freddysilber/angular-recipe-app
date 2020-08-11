import { Component, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'

import { Ingredient } from '../shared/ingredient.model'
import { ShoppingListService } from './shopping-list.service'
import * as fromShoppingList from './store/shopping-list.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>
  // private igChangeSub: Subscription

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')

    // this.ingredients = this.shoppingListService.getIngredients()
    // this.igChangeSub = this.shoppingListService.ingredientsChanges
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients
    //   })
  }

  ngOnDestroy() {
    // this.igChangeSub.unsubscribe()
  }

  onEditItem(index: number) {
    console.log('list item index', index)
    this.shoppingListService.startedEditing.next(index)
  }
}