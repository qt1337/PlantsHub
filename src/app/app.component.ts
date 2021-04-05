import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthenticationService} from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit {
  title = 'PlantsHub';
  showFiller = false;

  constructor(
    public router: Router,
    public authGuard: AuthGuard,
    public authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
  }

  isHomeRoute(): boolean {
    return this.router.url === '/';
  }

  isSignInRoute(): boolean {
    return this.router.url === '/signin';
  }

  isSignUpRoute(): boolean {
    return this.router.url === '/signup';
  }
}
