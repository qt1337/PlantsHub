import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDiaryComponent } from './plant-diary.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DemoMaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PlantDiaryComponent', () => {
  let component: PlantDiaryComponent;
  let fixture: ComponentFixture<PlantDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
      declarations: [ PlantDiaryComponent ],
      imports: [
        DemoMaterialModule,
        BrowserAnimationsModule]
    })

    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
