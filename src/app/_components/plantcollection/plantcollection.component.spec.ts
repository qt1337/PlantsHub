import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantcollectionComponent } from './plantcollection.component';

describe('PlantcollectionComponent', () => {
  let component: PlantcollectionComponent;
  let fixture: ComponentFixture<PlantcollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantcollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
