import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';
import {Router} from '@angular/router';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  private localURL: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();

    if (isDevMode()) {
      this.localURL = 'http://localhost:8080';
    } else {
      this.localURL = '';
    }
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public checkForActiveSession(): void {
    try {
      this.loginViaSessionId().pipe(first())
        .subscribe({
            next: () => {
              this.routeToHome();
            },
            error: error => {
              console.log(error);
              console.log('No active session');
            }
          }
        );
    } catch (e) {
      console.log('No active session');
    }
  }

  public checkForInactiveSession(): void {
    try {
      this.loginViaSessionId().pipe(first())
        .subscribe({
            next: (user) => {
              this.userSubject.next(user);
            },
            error: () => {
            }
          }
        );
    } catch (e) {
    }
  }

  private routeToHome(): void {
    const returnUrl = '/';
    this.router.navigateByUrl(returnUrl);
  }

  public loginViaSessionId(): Observable<User> {
    try {
      if (this.userValue && this.userValue[0]) {
        const sessionId = this.userValue[0].sessionId;
        const username = this.userValue[0].username;

        return this.http.post<User>(
          this.localURL + '/api/check-session',
          {
            sessionId,
            username
          },
          {responseType: 'json'}
        ).pipe(map(user => {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
          })
        );
      }
    } catch (error) {
      localStorage.removeItem('user');
      console.log(error);
    }
  }

  public login(username, password): Observable<User> {
    try {
      return this.http.post<User>(
        this.localURL + '/api/check-credentials',
        {
          username,
          password
        },
        {responseType: 'json'}
      ).pipe(map(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/signin']);
  }

  public register(username, email, password, forename, surname, birthday): Observable<User> {
    try {
      return this.http.post<User>(
        this.localURL + '/api/create-user',
        {
          username,
          email,
          password,
          forename,
          surname,
          birthday
        },
        {responseType: 'json'}
      ).pipe(map(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
