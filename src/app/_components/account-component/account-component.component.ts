import {Component, OnInit} from '@angular/core';
import {User} from "../../_models/user";
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.scss']
})
export class AccountComponent implements OnInit {
  user: User;
  inputFields: string[];
  inputFieldTitles: string[] = ['Username','Email','Forename','Surname','Birthday']

  isClicked: boolean;

  constructor(private userService : UserService) {

  }
  toggleDisabledAttributInput(): void {
    let inputFields: HTMLElement | any = document.getElementsByClassName('account-form-input');
    let inputFieldsArray = [...inputFields];

    inputFieldsArray.map(inputField => inputField.toggleAttribute("disabled"));
    this.isClicked = !this.isClicked;
  }


  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.inputFields = this.userService.getUserValues();
  }
}
