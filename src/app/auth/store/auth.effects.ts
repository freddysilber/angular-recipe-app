import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { switchMap, catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs'

import { environment } from 'src/environments/environment'

import * as AuthActions from './auth.actions'
import { User } from '../user.model'
import { AuthService } from '../auth.service'

const userLoginRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`
const userSignUpRoute: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`

export interface AuthResponseData {
	kind: string
	idToken: string
	email: string
	refreshToken: string
	expiresIn: string
	localId: string
	registered?: boolean
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
	const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)
	const user = new User(email, userId, token, expirationDate)
	localStorage.setItem('userData', JSON.stringify(user))
	return new AuthActions.AuthenticateSuccess({
		email,
		userId,
		token,
		expirationDate
	})
}

const handleError = (error: any) => {
	console.log(error)
	let errorMessage = 'An unknown error occured'
	if (!error.error || !error.error.error) {
		return of(new AuthActions.AuthenticateFail(errorMessage))
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
	return of(new AuthActions.AuthenticateFail(errorMessage))
}

@Injectable()
export class AuthEffects {
	@Effect()
	authSignup = this.actions$.pipe(
		ofType(AuthActions.SIGNUP_START),
		switchMap((signupAction: AuthActions.SignupStart) => {
			return this.http.post<AuthResponseData>(userSignUpRoute,
				{
					email: signupAction.payload.email,
					password: signupAction.payload.password,
					returnSecureToken: true
				}
			).pipe(
				tap(resData => {
					this.authService.setLogoutTimer(+resData.expiresIn * 1000)
				}),
				map(resData => {
					const { expiresIn, email, localId, idToken } = resData
					return handleAuthentication(+expiresIn, email, localId, idToken)
				}),
				catchError(error => {
					return handleError(error)
				})
			)
		})
	)

	@Effect()
	authLogin = this.actions$.pipe(
		ofType(AuthActions.LOGIN_START),
		switchMap((authData: AuthActions.LoginStart) => {
			return this.http.post<AuthResponseData>(userLoginRoute,
				{
					email: authData.payload.email,
					password: authData.payload.password,
					returnSecureToken: true
				}
			).pipe(
				tap(resData => {
					this.authService.setLogoutTimer(+resData.expiresIn * 1000)
				}),
				map(resData => {
					const { expiresIn, email, localId, idToken } = resData
					return handleAuthentication(+expiresIn, email, localId, idToken)
				}),
				catchError(error => {
					return handleError(error)
				})
			)
		})
	)

	@Effect({ dispatch: false })
	authRedirect = this.actions$.pipe(
		ofType(AuthActions.AUTHENTICATE_SUCCESS),
		tap(() => this.router.navigate(['/']))
	)

	@Effect({ dispatch: false })
	authLogout = this.actions$.pipe(
		ofType(AuthActions.LOGOUT),
		tap(() => {
			this.authService.clearLogoutTimer()
			localStorage.removeItem('userData')
			this.router.navigate(['/auth'])
		})
	)

	@Effect()
	autoLogin = this.actions$.pipe(
		ofType(AuthActions.AUTO_LOGIN),
		map(() => {
			const user: {
				email: string,
				id: string,
				_token: string,
				_tokenExpirationDate: string
			} = JSON.parse(localStorage.getItem('userData'))
			if (!user) {
				return { type: 'DUMMY' }
			}
			const { email, id, _token, _tokenExpirationDate } = user
			const loadedUser = new User(email, id, _token, new Date(_tokenExpirationDate))
			if (loadedUser.token) {
				const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
				this.authService.setLogoutTimer(expirationDuration)
				return new AuthActions.AuthenticateSuccess({
					email: loadedUser.email,
					userId: loadedUser.id,
					token: loadedUser.token,
					expirationDate: new Date(user._tokenExpirationDate)
				})
			}
			return { type: 'DUMMY' }
		})
	)

	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private router: Router,
		private authService: AuthService
	) { }
}