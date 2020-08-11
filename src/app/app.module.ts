import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
// Components
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
// Modules
import { AppRoutingModule } from './app-routing.module'
import { SharedModule } from './shared/shared.module'
import { CoreModule } from './core.module'
import { EffectsModule } from '@ngrx/effects'
// Reducers
import * as fromApp from './store/app.reducer'
// Effects
import { AuthEffects } from './auth/store/auth.effects'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    SharedModule,
    CoreModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}