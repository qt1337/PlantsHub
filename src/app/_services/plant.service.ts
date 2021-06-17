import {Injectable, isDevMode} from '@angular/core';
import {Plant} from '../_models/plant';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {PlantDiaryEntry} from '../_models/plantDiaryEntry';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private plantsSubject: BehaviorSubject<Plant[]>;
  private plantDiaryEntriesSubject: BehaviorSubject<PlantDiaryEntry[]>;
  private plants: Observable<Plant[]>;
  private localURL: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.plantsSubject = new BehaviorSubject<Plant[]>(JSON.parse(localStorage.getItem('plants')));
    this.plantDiaryEntriesSubject = new BehaviorSubject<PlantDiaryEntry[]>(JSON.parse(localStorage.getItem('plantDiaryEntries')));
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

  getPlantDiaryEntries(username, sessionId, plantId): Observable<PlantDiaryEntry[]> {
    try {
      return this.http.post<PlantDiaryEntry[]>(
        this.localURL + '/api/get-diary-entries',
        {
          username,
          sessionId,
          plantId,
        },
        {responseType: 'json'}
      ).pipe(map(plantDiaryEntries => {
          localStorage.removeItem('plantDiaryEntries');
          localStorage.setItem('plantDiaryEntries', JSON.stringify(plantDiaryEntries));
          this.plantDiaryEntriesSubject.next(plantDiaryEntries);
          return plantDiaryEntries;
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  createPlantDiaryEntry(username, sessionId, plantDiaryEntry, formData): Observable<PlantDiaryEntry[]> {
    try {
      const plantId = plantDiaryEntry.plantId || null;
      const watered = plantDiaryEntry.watered || false;
      const fertilized = plantDiaryEntry.fertilized || false;
      const date = plantDiaryEntry.date || null;
      const note = plantDiaryEntry.note || null;
      const size = plantDiaryEntry.size || null;
      const health = plantDiaryEntry.health || null;

      plantDiaryEntry = {
        plantId,
        watered,
        fertilized,
        date,
        note,
        size,
        health,
      };

      formData.append('plantDiaryEntry', plantDiaryEntry);

      return this.http.post<PlantDiaryEntry[]>(
        this.localURL + '/api/create-diary-entry',
        formData,
        {responseType: 'json'}
      ).pipe(map(plantDiaryEntries => {
          localStorage.removeItem('plantDiaryEntries');
          localStorage.setItem('plantDiaryEntries', JSON.stringify(plantDiaryEntries));
          this.plantDiaryEntriesSubject.next(plantDiaryEntries);
          return plantDiaryEntries;
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

}
