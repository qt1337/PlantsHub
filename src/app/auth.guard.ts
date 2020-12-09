import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from './_services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }


  isLoggedIn(): boolean {
    if (localStorage.getItem('user')) {
      this.authenticationService.loginViaSessionId();
      if (localStorage.getItem('user')) {
        return true;
      }
    }
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('user')) {
      this.authenticationService.loginViaSessionId();
      if (localStorage.getItem('user')) {
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/signin']); // , {queryParams: {returnUrl: state.url}});
    return false;
  }

}
