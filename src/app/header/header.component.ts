import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'

import { DataStorageService } from '../shared/data-storage.service'
// import { AuthService } from '../auth/auth.service'
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	private userSub: Subscription
	isAuthenticated: boolean = false

	constructor(
		private dataStorage: DataStorageService,
		// private authService: AuthService,
		private store: Store<fromApp.AppState>
	) { }

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
		this.dataStorage.storeRecipes()
	}

	onFetchData() {
		this.dataStorage.fetchRecipes().subscribe()
	}

	handleLogout() {
		this.store.dispatch(new AuthActions.Logout())
	}
}