import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AuthenticationService} from '../../_services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authenticationService: AuthenticationService
  ) {
    this.authenticationService.checkForInactiveSession();
    if (this.authenticationService.userValue) {
      this.user = this.authenticationService.userValue[0];
    } else {
    }
  }

  ngOnInit(): void {
  }
}
