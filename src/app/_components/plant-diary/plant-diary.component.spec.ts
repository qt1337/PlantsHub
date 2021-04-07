import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDiaryComponent } from './plant-diary.component';

describe('PlantDiaryComponent', () => {
  let component: PlantDiaryComponent;
  let fixture: ComponentFixture<PlantDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantDiaryComponent ]
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
