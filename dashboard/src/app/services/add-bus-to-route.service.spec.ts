import { TestBed } from '@angular/core/testing';

import { AddBusToRouteService } from './add-bus-to-route.service';

describe('AddBusToRouteService', () => {
  let service: AddBusToRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddBusToRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
