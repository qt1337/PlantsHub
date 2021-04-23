import { Component, OnInit, AfterContentInit } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../_models/user";

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.scss']
})
export class AccountComponent implements OnInit {
  user: User;

  constructor() { }

  ngOnInit(): void {
  }

  editAccountData() : void{
    const editInput : HTMLElement | any = document.getElementsByClassName('account-form-username-input');
    console.log("changed");
    editInput[0].toggleAttribute("disabled")
  }
}
