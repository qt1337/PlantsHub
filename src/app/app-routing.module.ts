import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './_components/sign-in/sign-in.component';
import {SignUpComponent} from './_components/sign-up/sign-up.component';
import {HomeComponent} from './_components/home/home.component';
import {PageNotFoundComponent} from './_components/page-not-found/page-not-found.component';
import {PlantcardComponent} from './_components/plantcard/plantcard.component';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'plants', component: PlantcardComponent, canActivate: [AuthGuard]},
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: '404', component: PageNotFoundComponent},

  // '**' has to be last!
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
