import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './_components/sign-in/sign-in.component';
import {HomepageComponent} from "./_components/homepage/homepage.component";
import {PageNotFoundComponent} from "./_components/page-not-found-component/page-not-found-component.component";

const routes: Routes = [
  { path: 'signin', component: SignInComponent },
  {path: '', redirectTo: '/signin', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {

  }
}
