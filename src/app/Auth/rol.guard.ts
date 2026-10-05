import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';
import { AuthServicio } from '../Servicios/auth-servicio';
export const rolGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authServicio = inject(AuthServicio);
  const router = inject(Router);
  const rolPermitido =
    route.data['rol'];
  const rolActual =
    authServicio.getRol();
  if (!authServicio.isLoggedIn()) {
    return router.createUrlTree([
      '/login'
    ]);
  }if (rolActual === rolPermitido) {

    return true;
  }
  if (rolActual === 'ADMIN') {

    return router.createUrlTree([
      '/admin/dashboard'
    ]);
  }return router.createUrlTree([
    '/usuario/dashboard'
  ]);
};