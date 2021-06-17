import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlantDialogueComponent} from './plant-dialogue.component';
import {HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PlantcardComponent} from "../plantcard/plantcard.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('PlantDialogueComponent', () => {
  let dialog : MatDialog;
  let component: PlantDialogueComponent;
  let fixture: ComponentFixture<PlantDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,
        DemoMaterialModule,
        BrowserAnimationsModule, MatDialogModule,
        FormsModule, ReactiveFormsModule],
      declarations: [PlantcardComponent, PlantDialogueComponent]
    })
      dialog = TestBed.get(MatDialog)
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

  it('Should have the Title Update your Plant', () => {
    const appComponent = fixture.debugElement.componentInstance;
    expect(appComponent.plantDialogueTitle).toEqual('Update PlantInfo');
  })
});
