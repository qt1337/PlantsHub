import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AuthenticationService} from '../../_services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.authenticationService.userValue && this.authenticationService.userValue[0]) {
      this.user = this.authenticationService.userValue[0];
    } else {
      console.log('Please sign in first.');
      const returnUrl = '/signin';
      this.router.navigateByUrl(returnUrl);
    }
  }

  ngOnInit(): void {
  }
}
