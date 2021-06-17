import {Component, OnInit, Output} from '@angular/core';
import {User} from '../../_models/user';
import {UserService} from '../../_services/user.service';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.scss']
})
export class AccountComponent implements OnInit {
  nameChangeLog: string[] = [];
  user: User;
  inputFields: string[];
  inputFieldsForms: string[] = ['username', 'email', 'forename', 'surname', 'birthday'];
  inputFieldTitles: string[] = ['Username', 'Email', 'Forename', 'Surname', 'Birthday'];

  SERVER_URL = 'http://localhost:8080/profile';
  isClicked: boolean;
  updateUserInformationForm: FormGroup;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.inputFields = this.userService.getUserValues();
    console.warn(this.inputFields);
    console.warn(this.userService.getUserValues());
    this.updateUserInformationForm = new FormGroup({
      username: new FormControl(this.inputFields[0]),
      email: new FormControl(this.inputFields[1]),
      forename: new FormControl(this.inputFields[2]),
      surname: new FormControl(this.inputFields[3]),
      birthday: new FormControl(this.inputFields[4]),
    })
    console.log(this.updateUserInformationForm);
  }

  getInputFieldTitles(index: number): string {
    return this.inputFieldTitles[index];
  }

  toggleDisabledAttributInput(): void {
    const inputFields: HTMLElement | any = document.getElementsByClassName('account-form-input');
    const inputFieldsArray = [...inputFields];

    inputFieldsArray.map(inputField => inputField.toggleAttribute('disabled'));
    this.isClicked = !this.isClicked;
  }

  deleteUser(): void {
    this.authenticationService.deleteUser();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message);
  }

  updateUserInformation = async (): Promise<void> => {

    await this.authenticationService.updateUser(
      this.updateUserInformationForm.value
    );

    await this.openSnackBar("You've successfully changed your User Information");
    setTimeout(() => window.location.reload(), 700);


  }
}
