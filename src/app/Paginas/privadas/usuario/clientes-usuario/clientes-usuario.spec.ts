import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesUsuario } from './clientes-usuario';

describe('ClientesUsuario', () => {
  let component: ClientesUsuario;
  let fixture: ComponentFixture<ClientesUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
