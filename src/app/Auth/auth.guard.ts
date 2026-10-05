import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicio } from '../Servicios/auth-servicio';
export const authGuard: CanActivateFn = (route, state) => {
  const authServicio = inject(AuthServicio);
  const router = inject(Router);
  const token = authServicio.getToken();
  if (!token) {

    return router.createUrlTree(
      ['/login'],
      {
        queryParams: {
          returnUrl: state.url
        }
      }
    );
  }
  return true;
};