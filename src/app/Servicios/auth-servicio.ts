import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LoginRequest } from '../../Modelos/LoginRequest';
import { AuthResponse } from '../../Modelos/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthServicio {

  private readonly urlApi =
    'http://localhost:8080/api/auth';

  private readonly platformId =
    inject(PLATFORM_ID);

  constructor(
    private http: HttpClient
  ) {}

  private esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(
    request: LoginRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.urlApi}/login`,
        request
      )
      .pipe(

        tap(response => {

          if (!this.esNavegador()) {
            return;
          }

          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem(
            'username',
            response.username
          );

          localStorage.setItem(
            'rol',
            response.rol
          );

        })

      );
  }

  logout(): void {

    if (!this.esNavegador()) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
  }

  isLoggedIn(): boolean {

    if (!this.esNavegador()) {
      return false;
    }

    return !!localStorage.getItem('token');
  }

  getToken(): string | null {

    if (!this.esNavegador()) {
      return null;
    }

    return localStorage.getItem('token');
  }

  getUsername(): string | null {

    if (!this.esNavegador()) {
      return null;
    }

    return localStorage.getItem('username');
  }

  getRol(): string | null {

    if (!this.esNavegador()) {
      return null;
    }

    return localStorage.getItem('rol');
  }

  estaAutenticado(): boolean {
    return this.isLoggedIn();
  }

  esAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  esUsuario(): boolean {

    const rol = this.getRol();

    return (
      rol === 'USUARIO' ||
      rol === 'USER'
    );
  }
}