import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component'
import { ShoppingListComponent } from './shopping-list.component'

@NgModule({
	declarations: [
		ShoppingEditComponent,
		ShoppingListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild([
			{
				path: 'shopping-list',
				component: ShoppingListComponent
			}
		])
	]
})
export class ShoppingListModule {

}