import {
	Component,
	ComponentFactoryResolver,
	ViewChild,
	OnDestroy,
	OnInit
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'

import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder.directive'
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
	@ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective

	isLoginMode: boolean = true
	isLoading: boolean = false
	error: string = null

	private closeSub: Subscription
	private storeSub: Subscription

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private store: Store<fromApp.AppState>
	) { }

	ngOnInit() {
		this.storeSub = this.store.select('auth').subscribe(authState => {
			this.isLoading = authState.loading
			this.error = authState.authError
			if (this.error) {
				this.showErrorAlert(this.error)
			}
		})
	}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return
		}
		const { email, password } = form.value
		if (this.isLoginMode) {
			this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }))
		} else {
			this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password }))
		}
		form.reset()
	}
	// This really isnt used anywhere so I dont know if we need it anymore
	onHandleError() {
		this.store.dispatch(new AuthActions.ClearError())
	}

	ngOnDestroy() {
		if (this.closeSub) {
			this.closeSub.unsubscribe()
		}
		if (this.storeSub) {
			this.storeSub.unsubscribe()
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
			this.onHandleError() // This is optional?
		})
	}
}