import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlantcardComponent} from './plantcard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

describe('PlantcardComponent', () => {
  let component: PlantcardComponent;
  let fixture: ComponentFixture<PlantcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlantcardComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});