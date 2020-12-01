import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public loginViaSessionId(): Observable<User> {
    try {
      if (this.userValue && this.userValue[0]) {
        console.log('user has active session');
        return this.user;
      }
      return this.http.post<User>(
        '/api/check-session',
        {},
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

  public login(username, password): Observable<User> {
    return this.http.post<User>(
      '/api/check-credentials',
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
  }

  public logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  public register(username, email, password, forename, surname, birthday): Observable<User> {
    return this.http.post<User>(
      '/api/create-user',
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
  }
}