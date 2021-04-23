import {Component, OnInit} from '@angular/core';
import {User} from "../_models/user";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.scss']
})
export class AccountComponent implements OnInit {
  user: User;
  isClicked: boolean;


  constructor(private userService : UserService) {

  }
  toggleDisabledAttributInput(): void {
    const inputField: HTMLElement | unknown = document.getElementsByClassName('account-form-username-input');
    inputField[0].toggleAttribute("disabled");
    this.isClicked = !this.isClicked;
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }
}
