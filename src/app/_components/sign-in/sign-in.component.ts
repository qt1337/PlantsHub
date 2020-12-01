import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: boolean;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.checkForSession();
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
  }

  // tslint:disable-next-line:typedef
  get form() {
    return this.loginForm.controls;
  }

  checkForSession(): void {
    this.authenticationService.loginViaSessionId().pipe(first())
      .subscribe({
          next: () => {
            // get return url from query parameters or default to home page
            const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
            this.router.navigateByUrl(returnUrl);
          },
          error: error => {
            console.log(error);
            console.log('No active session');
          }
        }
      );
  }

  onLogin(): void {
    this.submitted = true;
    this.error = false;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const username = this.form.username.value;
    const password = this.form.password.value;
    this.authenticationService.login(username, password).pipe(first())
      .subscribe({
          next: () => {
            // get return url from query parameters or default to home page
            const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
            this.router.navigateByUrl(returnUrl);
          },
          error: error => {
            console.log(error);
            console.log('Wrong credentials or Server error');
            this.loading = false;
            this.error = true;
          }
        }
      );
  }
}
