import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthServicio } from '../../../Servicios/auth-servicio';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-compents.html',
  styleUrls: ['./login-compents.scss']
})
export class LoginCompents {

  loginForm: FormGroup;

  showPassword = signal(false);
  isLoading = signal(false);
  errorMensaje = signal('');

  constructor(
    private fb: FormBuilder,
    private authServicio: AuthServicio,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(
      valor => !valor
    );
  }

  onSubmit(): void {

    this.errorMensaje.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const username =
      this.loginForm.get('username')?.value?.trim();

    const password =
      this.loginForm.get('password')?.value;

    this.authServicio.login({
      username,
      password
    }).subscribe({

      next: (response) => {

        this.isLoading.set(false);

        console.log('Respuesta login:', response);
        console.log('Rol:', response.rol);

        if (response.rol === 'ADMIN') {

          this.router
            .navigate(['/admin/dashboard'])
            .then(resultado => {

              console.log(
                'Navegación ADMIN:',
                resultado
              );

            });

          return;
        }

        if (
          response.rol === 'USUARIO' ||
          response.rol === 'USER'
        ) {

          this.router
            .navigate(['/usuario/dashboard'])
            .then(resultado => {

              console.log(
                'Navegación USUARIO:',
                resultado
              );

            });

          return;
        }

        console.error(
          'Rol no reconocido:',
          response.rol
        );

        this.errorMensaje.set(
          'El usuario no tiene un rol válido.'
        );
      },

      error: (error) => {

        console.error(
          'Error de autenticación:',
          error
        );

        this.isLoading.set(false);

        if (error.status === 400) {

          this.errorMensaje.set(
            'Los datos enviados no son válidos.'
          );

        } else if (error.status === 401) {

          this.errorMensaje.set(
            'Usuario o contraseña incorrectos.'
          );

        } else if (error.status === 403) {

          this.errorMensaje.set(
            'El usuario no tiene permiso para ingresar.'
          );

        } else if (error.status === 0) {

          this.errorMensaje.set(
            'No se puede conectar con el servidor.'
          );

        } else {

          this.errorMensaje.set(
            'Ocurrió un error al iniciar sesión.'
          );
        }
      }
    });
  }

  loginWithProvider(
    provider: 'google' | 'apple' | 'biometric'
  ): void {

    console.log(
      'Autenticación mediante:',
      provider
    );
  }
}