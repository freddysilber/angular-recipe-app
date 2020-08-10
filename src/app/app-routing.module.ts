import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/recipes',
		pathMatch: 'full'
	},
	{
		path: 'recipes',
		// Lazy loading w/ dynamic loading (routing)
		loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
		//! this is the old way of lazy loading
		// loadChildren: './recipes/recipes.module#RecipesModule'
	}
]

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}