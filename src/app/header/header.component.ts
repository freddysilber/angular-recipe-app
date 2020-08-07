import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'

import { DataStorageService } from '../shared/data-storage.service'
import { AuthService } from '../auth/auth.service'

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
		private authService: AuthService
	) { }

	ngOnInit() {
		this.userSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user)
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
}