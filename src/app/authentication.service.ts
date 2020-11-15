import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './_models/user';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  login(account, password): Observable<User> {
    return this.http.post<User>(
      'https://plantshub.de/api/check-credentials',
      {
        account,
        password
      },
      {responseType: 'json'}
    ).pipe(map(user => {
        localStorage.setItem('account', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }
}
