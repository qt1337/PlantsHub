import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AuthenticationService} from '../../_services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  todoList: string[] = ['Water your Plant Gertrude', 'Fertilize Olga'];


  constructor(
    private userService : UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.user = this.userService.getUser();

  }
}
