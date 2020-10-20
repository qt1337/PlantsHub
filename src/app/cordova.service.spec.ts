import { TestBed } from '@angular/core/testing';

import { CordovaService } from './cordova.service';

describe('CordovaService', () => {
  let service: CordovaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CordovaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
