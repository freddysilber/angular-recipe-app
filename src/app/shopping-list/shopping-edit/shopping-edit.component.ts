import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Ingredient } from 'src/app/shared/ingredient.model'
import { ShoppingListService } from '../shopping-list.service'
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm
  subscription: Subscription
  editMode: boolean = false
  editedItemIndex: number
  editedItem: Ingredient

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index
          this.editMode = true
          this.editedItem = this.shoppingListService.getIngredient(index)
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  // Edits or creates a new ingredient
  onSubmit(form: NgForm) {
    const { name, amount } = form.value
    const newIngredient = new Ingredient(name, amount)
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    } else {
      this.shoppingListService.addIngredient(newIngredient)
    }
    this.editMode = false
    form.reset()
  }
  // Clears the form
  onClear() {
    this.slForm.reset()
    this.editMode = false
  }
  // Deletes an ingredient
  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex)
    this.onClear()
  }
}