import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Store } from '@ngrx/store'

import { User } from './user.model'
import { environment } from '../../environments/environment'
import * as fromApp from '../store/app.reducer'
import * as  AuthActions from './store/auth.actions'

export interface AuthResponseData {
	kind: string
	idToken: string
	email: string
	refreshToken: string
	expiresIn: string
	localId: string
	registered?: boolean
}

const userSignUpRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`
const userLoginRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private tokenExpirationTimer: any

	constructor(
		private http: HttpClient,
		private router: Router,
		private store: Store<fromApp.AppState>
	) { }

	signup(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(userSignUpRoute, this.buildAuthBody(email, password))
			.pipe(catchError(this.handleError),
				tap(response => {
					const { email, localId, idToken, expiresIn } = response
					this.handleAuthentication(email, localId, idToken, +expiresIn)
				})
			)
	}

	login(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(userLoginRoute, this.buildAuthBody(email, password))
			.pipe(catchError(this.handleError),
				tap(response => {
					const { email, localId, idToken, expiresIn } = response
					this.handleAuthentication(email, localId, idToken, +expiresIn)
				})
			)
	}

	autoLogin() {
		const user: {
			email: string,
			id: string,
			_token: string,
			_tokenExpirationDate: string
		} = JSON.parse(localStorage.getItem('userData'))
		if (!user) {
			return
		}
		const { email, id, _token, _tokenExpirationDate } = user
		const loadedUser = new User(email, id, _token, new Date(_tokenExpirationDate))
		if (loadedUser.token) {
			this.store.dispatch(
				new AuthActions.Login({
					email: loadedUser.email,
					userId: loadedUser.id,
					token: loadedUser.token,
					expirationDate: new Date(user._tokenExpirationDate)
				})
			)
			const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
			this.autoLogout(expirationDuration)
		}
	}

	logout() {
		this.store.dispatch(new AuthActions.Logout())
		this.router.navigate(['/auth'])
		localStorage.removeItem('userData')
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer)
		}
		this.tokenExpirationTimer = null
	}

	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.logout()
		}, expirationDuration)
	}

	private buildAuthBody(email: string, password: string) {
		return {
			email,
			password,
			returnSecureToken: true
		}
	}

	private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
		const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)
		const user = new User(
			email,
			userId,
			token,
			expirationDate
		)
		this.store.dispatch(new AuthActions.Login({
			email,
			userId,
			token,
			expirationDate
		}))
		this.autoLogout(expiresIn * 1000)
		localStorage.setItem('userData', JSON.stringify(user))
	}

	private handleError(error: HttpErrorResponse) {
		let errorMessage = 'An unknown error occured'
		if (!error.error || !error.error.error) {
			return throwError(errorMessage)
		}
		switch (error.error.error.message) {
			case 'EMAIL_EXISTS':
				errorMessage = 'This user already exists with this email'
				break
			case 'EMAIL_NOT_FOUND':
				errorMessage = 'The email you entered was not found'
				break
			case 'INVALID_PASSWORD':
				errorMessage = 'The password you entered was inccorect'
				break
		}
		return throwError(errorMessage)
	}
}