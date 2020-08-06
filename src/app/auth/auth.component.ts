import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent {
	isLoginMode: boolean = true

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode
	}

	onSubmit(form: NgForm) {
		console.log(form.value)
		form.reset()
	}
}