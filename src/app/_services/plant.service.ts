import {Injectable} from '@angular/core';
import {Plant} from '../_models/plant';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private plantsSubject: BehaviorSubject<Plant[]>;
  private plants: Observable<Plant[]>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.plantsSubject = new BehaviorSubject<Plant[]>(JSON.parse(localStorage.getItem('plants')));
    this.plants = this.plantsSubject.asObservable();
  }

  public get plantsValue(): Plant[] {
    return this.plantsSubject.value;
  }

  getPlants(username, sessionId): Observable<Plant[]> {
    try {
      if (!this.authenticationService.userValue || !this.authenticationService.userValue[0]) {
        this.router.navigate(['/signin']);
        return null;
      }
      return this.http.post<Plant[]>(
        '/api/get-plants',
        {
          username,
          sessionId
        },
        {responseType: 'json'}
      ).pipe(map(plants => {
          localStorage.setItem('plants', JSON.stringify(plants));
          this.plantsSubject.next(plants);
          return plants;
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  updatePlantFavourite(username, sessionId, plantId, favourite): Observable<Plant[]> {
    try {
      return this.http.post<Plant[]>(
        '/api/update-plant',
        {
          username,
          sessionId,
          plantId,
          favourite
        },
        {responseType: 'json'}
      ).pipe(map(plants => {
          localStorage.removeItem('plants');
          localStorage.setItem('plants', JSON.stringify(plants));
          this.plantsSubject.next(plants);
          return plants;
        })
      );
    } catch (e) {
      console.log(e);
    }
  }
}
