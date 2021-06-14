import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlantcollectionComponent} from './plantcollection.component';
import {DemoMaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchboxComponent} from '../searchbox/searchbox.component';
import {SortbyComponent} from '../sortby/sortby.component';
import {PlantcardComponent} from '../plantcard/plantcard.component';
import {HttpClientModule} from '@angular/common/http';
import {Ng2SearchPipeModule} from 'ng2-search-filter';

describe('PlantcollectionComponent', () => {
  let component: PlantcollectionComponent;
  let fixture: ComponentFixture<PlantcollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlantcollectionComponent,
        SearchboxComponent,
        SortbyComponent,
        PlantcardComponent],
      imports: [
        DemoMaterialModule,
        BrowserAnimationsModule,
        HttpClientModule,
        Ng2SearchPipeModule]
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
