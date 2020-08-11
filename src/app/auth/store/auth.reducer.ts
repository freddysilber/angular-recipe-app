import { User } from '../user.model'
import * as AuthActions from './auth.actions'

export interface State {
	user: User
	authError: string,
	loading: boolean
}

const initialState: State = {
	user: null,
	authError: null,
	loading: false
}

export function authReducer(
	state: State = initialState,
	action: AuthActions.AuthActions
) {
	switch (action.type) {
		case AuthActions.AUTHENTICATE_SUCCESS:
			const { email, userId, token, expirationDate } = action.payload
			const user = new User(email, userId, token, expirationDate)
			return {
				...state,
				user,
				authError: null,
				loading: false
			}
		case AuthActions.LOGOUT:
			return {
				...state,
				user: null
			}
		case AuthActions.LOGIN_START:
		case AuthActions.SIGNUP_START:
			return {
				...state,
				authError: null,
				loading: true
			}
		case AuthActions.AUTHENTICATE_FAIL:
			return {
				...state,
				user: null,
				authError: action.payload,
				loading: false
			}
		case AuthActions.CLEAR_ERROR:
			return {
				...state,
				authError: null
			}
		default:
			return state
	}
}