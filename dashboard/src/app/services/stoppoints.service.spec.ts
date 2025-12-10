import { TestBed } from '@angular/core/testing';

import { StoppointsService } from './stoppoints.service';

describe('StoppointsService', () => {
  let service: StoppointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoppointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
