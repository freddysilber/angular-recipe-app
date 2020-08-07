import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'

import { AuthService, AuthResponseData } from './auth.service'
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder.directive'

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
	@ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective
	isLoginMode: boolean = true
	isLoading: boolean = false
	private closeSub: Subscription

	constructor(
		private authService: AuthService,
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver
	) { }

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
			this.showErrorAlert(errorMessage)
			this.toggleIsLoading()
		})
		form.reset()
	}

	ngOnDestroy() {
		if (this.closeSub) {
			this.closeSub.unsubscribe()
		}
	}

	private showErrorAlert(message: string) {
		const component = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
		const hostViewContainerRef = this.alertHost.viewContainerRef
		hostViewContainerRef.clear()
		const componentRef = hostViewContainerRef.createComponent(component)
		componentRef.instance.message = message
		this.closeSub = componentRef.instance.close.subscribe(() => {
			this.closeSub.unsubscribe()
			hostViewContainerRef.clear()
		})
	}
	
	private toggleIsLoading() {
		this.isLoading = !this.isLoading
	}
}