import { TestBed } from '@angular/core/testing';

import { WhatsserviceUser } from './whatsservice-user';

describe('WhatsserviceUser', () => {
  let service: WhatsserviceUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsserviceUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
