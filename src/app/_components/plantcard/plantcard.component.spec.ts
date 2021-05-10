import {ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {PlantcardComponent} from './plantcard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {DemoMaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AbstractMockObservableService} from "../../_services/mocks/mock.service";
import {Plant} from "../../_models/plant";
import {PlantService} from "../../_services/plant.service";
import {By} from "@angular/platform-browser";
import any = jasmine.any;

class MockService extends AbstractMockObservableService {
  updatePlant(plant : Plant) {
    this.content = [plant];
    return this;
  }

  getPlants() {
    let mockPlant = {
      plantId: 1,
      plantName: 'Olga',
      wateringInterval: 2,
      fertilizingInterval: 2,
      plantBirthday: '2020-05-12',
      plantDeathday: '2020-06-12',
      family: 'Olgawitsch',
      type: 'Russian',
      species: 'Russian',
      image: 'beautifulimage.png',
      lux: '200',
      favourite: false,
      active: true
    }
    this.content = [mockPlant];
  }
}

describe('PlantcardComponent', () => {
  let component: PlantcardComponent;
  let fixture: ComponentFixture<PlantcardComponent>;
  let mockService;
  let element;

  beforeEach(async () => {
    mockService = new MockService();
    await TestBed.configureTestingModule({
      providers : [{provide: PlantService, useValue: mockService}],
      declarations: [PlantcardComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatDialogModule,
        RouterModule,
        Ng2SearchPipeModule,
        DemoMaterialModule,
        BrowserAnimationsModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the favourite value', () => {

    component.plants = [
      {
        plantId: 1,
        plantName: 'Olga',
        wateringInterval: 2,
        fertilizingInterval: 2,
        plantBirthday: '2020-05-12',
        plantDeathday: '2020-06-12',
        family: 'Olgawitsch',
        type: 'Russian',
        species: 'Russian',
        image: 'beautifulimage.png',
        lux: '200',
        favourite: false,
        active: true
      }
    ]
    component.ngOnInit();
    fixture.detectChanges();
    const favouriteButtonElement = fixture.debugElement.query(By.css('[name=heart]'));
    favouriteButtonElement.nativeElement.click();
    expect(component.plants[0].favourite).toBe(true);
  });
});
