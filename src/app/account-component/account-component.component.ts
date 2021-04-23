import { Component } from '@angular/core';
import {User} from "../_models/user";

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.scss']
})
export class AccountComponent  {
  user: User;
  isClicked: boolean;


  toggleDisabledAttributInput() : void {
    const inputField : HTMLElement | unknown = document.getElementsByClassName('account-form-username-input');
    inputField[0].toggleAttribute("disabled");
    this.isClicked = !this.isClicked;
  }
}
