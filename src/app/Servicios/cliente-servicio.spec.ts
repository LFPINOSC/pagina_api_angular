import { TestBed } from '@angular/core/testing';

import { ClienteServicio } from './cliente-servicio';

describe('ClienteServicio', () => {
  let service: ClienteServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
