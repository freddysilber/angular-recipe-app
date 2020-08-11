import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
	UrlTree
} from "@angular/router"
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'

import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store'

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(
		private router: Router,
		private store: Store<fromApp.AppState>
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		router: RouterStateSnapshot
	): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
		return this.store.select('auth').pipe(
			take(1), map(authState => {
				return authState.user
			}),
			map(user => !!user ? true : this.router.createUrlTree(['/auth'])))
	}
}