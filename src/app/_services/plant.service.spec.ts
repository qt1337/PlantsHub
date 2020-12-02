import {TestBed} from '@angular/core/testing';

import {PlantService} from './plant.service';
import {HttpClientModule} from '@angular/common/http';

describe('PlantService', () => {
  let service: PlantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(PlantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
