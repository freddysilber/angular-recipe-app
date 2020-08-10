import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component'
import { ShoppingListComponent } from './shopping-list.component'
import { SharedModule } from '../shared/shared.module'

@NgModule({
	declarations: [
		ShoppingEditComponent,
		ShoppingListComponent
	],
	imports: [
		SharedModule,
		FormsModule,
		RouterModule.forChild([
			{
				path: '',
				component: ShoppingListComponent
			}
		])
	]
})
export class ShoppingListModule {

}