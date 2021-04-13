import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from "./material.module";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [HttpClientModule, DemoMaterialModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PlantsHub'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PlantsHub');
  });

});
