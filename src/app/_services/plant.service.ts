import {Injectable, isDevMode} from '@angular/core';
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
  private localURL: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.plantsSubject = new BehaviorSubject<Plant[]>(JSON.parse(localStorage.getItem('plants')));
    this.plants = this.plantsSubject.asObservable();

    if (isDevMode()) {
      this.localURL = 'http://localhost:8080';
    } else {
      this.localURL = '';
    }
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
        this.localURL + '/api/get-plants',
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

  updatePlant(username, sessionId, plant): Observable<Plant[]> {
    try {
      return this.http.post<Plant[]>(
        this.localURL + '/api/update-plant',
        {
          username,
          sessionId,
          plant
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

  addPlant(username, sessionId, plant, formData): Observable<Plant[]> {
    try {
      const plantName = plant.plantName || null;
      const family = plant.family || null;
      const wateringInterval = plant.wateringInterval || null;
      const fertilizingInterval = plant.fertilizingInterval || null;
      const plantBirthday = plant.plantBirthday || null;

      formData.append('username', username);
      formData.append('sessionId', sessionId);
      formData.append('plantName', plantName);
      formData.append('family', family);
      formData.append('wateringInterval', wateringInterval);
      formData.append('fertilizingInterval', fertilizingInterval);
      formData.append('plantBirthday', plantBirthday);

      return this.http.post<Plant[]>(
        this.localURL + '/api/create-plant',
        formData,
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
