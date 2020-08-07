import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, tap } from 'rxjs/operators'
import { throwError, BehaviorSubject } from 'rxjs'
import { User } from './user.model'
import { Router } from '@angular/router'

export interface AuthResponseData {
	kind: string
	idToken: string
	email: string
	refreshToken: string
	expiresIn: string
	localId: string
	registered?: boolean
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user = new BehaviorSubject<User>(null)
	private tokenExpirationTimer: any
	private apiKey: string = 'AIzaSyDpS6Kmy5m1U1gL_24s2zEFpJF8gXgWAdw'
	private userSignUpRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`
	private userLoginRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`

	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	signup(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(this.userSignUpRoute, this.buildAuthBody(email, password))
			.pipe(catchError(this.handleError),
				tap(response => {
					const { email, localId, idToken, expiresIn } = response
					this.handleAuthentication(email, localId, idToken, +expiresIn)
				})
			)
	}

	login(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(this.userLoginRoute, this.buildAuthBody(email, password))
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
			this.user.next(loadedUser)
			const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
			this.autoLogout(expirationDuration)
		}
	}

	logout() {
		this.user.next(null)
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
			email: email,
			password: password,
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
		this.user.next(user)
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