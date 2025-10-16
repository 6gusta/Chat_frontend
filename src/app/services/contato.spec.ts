import { TestBed } from '@angular/core/testing';

import { Contato } from './contato';

describe('Contato', () => {
  let service: Contato;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contato);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
