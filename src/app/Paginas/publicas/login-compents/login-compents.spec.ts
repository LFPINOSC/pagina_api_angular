import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCompents } from './login-compents';

describe('LoginCompents', () => {
  let component: LoginCompents;
  let fixture: ComponentFixture<LoginCompents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCompents],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCompents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
