import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './_components/sign-in/sign-in.component';
import {SignUpComponent} from './_components/sign-up/sign-up.component';
import {HomeComponent} from './_components/home/home.component';
import {PageNotFoundComponent} from "./_components/page-not-found-component/page-not-found-component.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {

  }
}
