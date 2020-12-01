import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './_components/sign-in/sign-in.component';
import {SignUpComponent} from './_components/sign-up/sign-up.component';
import {HomeComponent} from './_components/home/home.component';
import {AppComponent} from './app.component';
import {PageNotFoundComponent} from './_components/page-not-found/page-not-found.component';
import {PlantcardComponent} from "./_components/plantcard/plantcard.component";

const routes: Routes = [
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent},
  {path: 'plants', component:PlantcardComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {

  }
}
