import {Component, OnInit, Output} from '@angular/core';
import {User} from '../../_models/user';
import {UserService} from '../../_services/user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.scss']
})
export class AccountComponent implements OnInit {
  nameChangeLog: string[] = [];
  user: User;
  inputFields: string[];
  inputFieldTitles: string[] = ['Username', 'Email', 'Forename', 'Surname', 'Birthday'];

  SERVER_URL = 'http://localhost:8080/profile';
  isClicked: boolean;
  updateUserInformationForm: FormGroup;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {

  }

  toggleDisabledAttributInput(): void {
    const inputFields: HTMLElement | any = document.getElementsByClassName('account-form-input');
    const inputFieldsArray = [...inputFields];

    inputFieldsArray.map(inputField => inputField.toggleAttribute('disabled'));
    this.isClicked = !this.isClicked;
  }


  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.inputFields = this.userService.getUserValues();
  }

  updateUserInformation() {
    //tbd
  }

  // TODO: Lisa pls implement these two functions [update, delete]
  deleteUser(): void {
    this.authenticationService.deleteUser();
  }

  updateUser(): void {
    this.authenticationService.updateUser(
      this.inputFields[0],
      this.inputFields[1],
      this.inputFields[2],
      this.inputFields[3],
      this.inputFields[4]
    );
  }
}
