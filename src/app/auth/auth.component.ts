import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'

import { AuthService, AuthResponseData } from './auth.service'

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent {
	isLoginMode: boolean = true
	isLoading: boolean = false
	error: string = null

	constructor(private authService: AuthService, private router: Router) { }

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return
		}
		const { email, password } = form.value
		let authObs: Observable<AuthResponseData>
		this.toggleIsLoading()
		authObs = this.isLoginMode ? this.authService.login(email, password) : authObs = this.authService.signup(email, password)
		authObs.subscribe(data => {
			console.log(data)
			this.toggleIsLoading()
			this.router.navigate(['/recipes'])
		}, errorMessage => {
			this.error = errorMessage
			this.toggleIsLoading()
		})
		form.reset()
	}

	private toggleIsLoading() {
		this.isLoading = !this.isLoading
	}
}