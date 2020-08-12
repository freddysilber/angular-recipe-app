import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'

import { Ingredient } from '../../shared/ingredient.model'
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm
  subscription: Subscription
  editMode: boolean = false
  editedItem: Ingredient

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true
        this.editedItem = stateData.editedIngredient
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
  // Edits or creates a new ingredient
  onSubmit(form: NgForm) {
    const { name, amount } = form.value
    const newIngredient = new Ingredient(name, amount)
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.editMode = false
    form.reset()
  }
  // Clears the form
  onClear() {
    this.slForm.reset()
    this.editMode = false
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
  // Deletes an ingredient
  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear()
  }
}