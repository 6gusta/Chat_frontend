import { TestBed } from '@angular/core/testing';

import { DisparoService } from './disparo-service';

describe('DisparoService', () => {
  let service: DisparoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisparoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
