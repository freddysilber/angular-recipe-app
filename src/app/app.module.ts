// Angular
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
// NgRx
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
// Components
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
// Modules
import { AppRoutingModule } from './app-routing.module'
import { SharedModule } from './shared/shared.module'
import { CoreModule } from './core.module'
// Reducers
import * as fromApp from './store/app.reducer'
// Effects
import { AuthEffects } from './auth/store/auth.effects'
import { RecipeEffects } from './recipes/store/recipe.effects'
// Miscellaneous/ Environment
import { environment } from 'src/environments/environment'

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
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    // This is for the Redux Dev Tools extension in the browser
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    // This simply displays more granular details about our routes and NgRx actions...
    StoreRouterConnectingModule.forRoot(),
    SharedModule,
    CoreModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }