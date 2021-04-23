import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {User} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user : User;
  constructor(
    public authenticationService: AuthenticationService
  ) {
    this.authenticationService.checkForInactiveSession();
    if (this.authenticationService.userValue) {
      this.user = this.authenticationService.userValue[0];
    }

  }

  getUser() : User {
    return this.user;
  }
}
