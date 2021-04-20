import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SortbyComponent} from './sortby.component';
import {DemoMaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('SortbyComponent', () => {
  let component: SortbyComponent;
  let fixture: ComponentFixture<SortbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortbyComponent],
      imports: [
        DemoMaterialModule,
        BrowserAnimationsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
