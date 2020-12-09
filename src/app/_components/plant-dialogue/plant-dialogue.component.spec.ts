import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDialogueComponent } from './plant-dialogue.component';

describe('PlantDialogueComponent', () => {
  let component: PlantDialogueComponent;
  let fixture: ComponentFixture<PlantDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
