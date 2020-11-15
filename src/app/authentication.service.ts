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
    console.log(this.http.post<any>(`http://localhost:8080/api/check-credentials/users/authenticate`,
      {username, password}
      ).subscribe(response => {
        return 'test'; // response.status;
      })
    );
  }
}
