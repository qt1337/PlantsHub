import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login(username, password): void {
    this.http.post(`https://plantshub.herokuapp.com/api/check-credentials`,
      {username, password}
    ).subscribe(response => {
        return 'test'; // response.status;
      }
    );
  }
}
