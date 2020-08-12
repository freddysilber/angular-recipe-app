import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import * as fromApp from '../store/app.reducer'
import * as  AuthActions from './store/auth.actions'

// export interface AuthResponseData {
// 	kind: string
// 	idToken: string
// 	email: string
// 	refreshToken: string
// 	expiresIn: string
// 	localId: string
// 	registered?: boolean
// }

@Injectable({ providedIn: 'root' })
export class AuthService {
	private tokenExpirationTimer: any

	constructor(private store: Store<fromApp.AppState>) { }

	setLogoutTimer(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.store.dispatch(new AuthActions.Logout())
		}, expirationDuration)
	}

	clearLogoutTimer() {
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer)
			this.tokenExpirationTimer = null
		}
	}
}