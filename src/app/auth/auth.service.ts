import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, tap } from 'rxjs/operators'
import { throwError, Subject } from 'rxjs'
import { User } from './user.model'

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
	user = new Subject<User>()
	private apiKey: string = 'AIzaSyDpS6Kmy5m1U1gL_24s2zEFpJF8gXgWAdw'
	private userSignUpRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`
	private userLoginRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`

	constructor(private http: HttpClient) { }

	signup(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				this.userSignUpRoute,
				{
					email: email,
					password: password,
					returnSecureToken: true
				}
			)
			.pipe(catchError(this.handleError),
				tap(response => {
					this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn)
				}))
	}

	login(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				this.userLoginRoute,
				{
					email: email,
					password: password,
					returnSecureToken: true
				}
			)
			.pipe(catchError(this.handleError), tap(response => {
				this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn)
			}))
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