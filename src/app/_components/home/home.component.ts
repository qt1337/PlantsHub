import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.userValue[0];
  }

  ngOnInit(): void {
  }
}
