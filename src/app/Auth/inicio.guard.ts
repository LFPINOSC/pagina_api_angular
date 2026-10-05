import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthServicio }
  from '../Servicios/auth-servicio';

export const inicioGuard: CanActivateFn = () => {

  const authServicio = inject(AuthServicio);
  const router = inject(Router);

  const token = authServicio.getToken();
  const rol = authServicio.getRol();

  if (!token) {
    return true;
  }

  if (rol === 'ADMIN') {

    return router.createUrlTree([
      '/admin/dashboard'
    ]);
  }

  if (
    rol === 'USUARIO' ||
    rol === 'USER'
  ) {

    return router.createUrlTree([
      '/usuario/dashboard'
    ]);
  }

  authServicio.logout();

  return true;
};