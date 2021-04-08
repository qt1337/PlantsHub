import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlantDialogueComponent} from './plant-dialogue.component';
import {HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PlantDialogueComponent', () => {
  let component: PlantDialogueComponent;
  let fixture: ComponentFixture<PlantDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,
        DemoMaterialModule,
        BrowserAnimationsModule],
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
