import { TestBed } from '@angular/core/testing';

import { WhatsService } from './whats-service';

describe('WhatsService', () => {
  let service: WhatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
