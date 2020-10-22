import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';

const routes: Routes = [
  { path: 'signin', component: SignInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {

  }
}
