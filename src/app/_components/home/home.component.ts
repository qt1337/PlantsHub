import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AuthenticationService} from '../../_services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authenticationService: AuthenticationService
  ) {
    this.checkForSession();
  }

  checkForSession(): void {
    try {
      this.authenticationService.loginViaSessionId().pipe(first())
        .subscribe({
            next: (user) => {
              console.log('session is valid.');
              this.user = user[0];
            },
            error: () => {
              console.log('No active session');
              const returnUrl = this.route.snapshot.queryParams.returnUrl || '/signin';
              this.router.navigateByUrl(returnUrl);
            }
          }
        );
    } catch (e) {
      console.log('No active session');
      const returnUrl = this.route.snapshot.queryParams.returnUrl || '/signin';
      this.router.navigateByUrl(returnUrl);
    }
  }

  ngOnInit(): void {
  }
}
