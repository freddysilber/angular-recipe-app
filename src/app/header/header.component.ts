import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'

import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipeActions from '../recipes/store/recipe.actions'

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	private userSub: Subscription
	isAuthenticated: boolean = false

	constructor(private store: Store<fromApp.AppState>) { }

	ngOnInit() {
		this.userSub = this.store
			.select('auth')
			.pipe(map(authState => authState.user))
			.subscribe(user => this.isAuthenticated = !!user)
	}

	ngOnDestroy() {
		this.userSub.unsubscribe()
	}

	onSaveData() {
		this.store.dispatch(new RecipeActions.StoreRecipes())
	}

	onFetchData() {
		this.store.dispatch(new RecipeActions.FetchRecipes())
	}

	handleLogout() {
		this.store.dispatch(new AuthActions.Logout())
	}
}