import { TestBed } from '@angular/core/testing';

import { ProntasServices } from './prontas-services';

describe('ProntasServices', () => {
  let service: ProntasServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProntasServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
