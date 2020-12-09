import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlantDialogueComponent} from './plant-dialogue.component';
import {HttpClientModule} from '@angular/common/http';

describe('PlantDialogueComponent', () => {
  let component: PlantDialogueComponent;
  let fixture: ComponentFixture<PlantDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [PlantDialogueComponent]
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
