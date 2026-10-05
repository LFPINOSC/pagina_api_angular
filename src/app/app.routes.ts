import { Routes } from '@angular/router';
import { LoginCompents } from './Paginas/publicas/login-compents/login-compents';
import { authGuard } from './Auth/auth.guard';
import { rolGuard } from './Auth/rol.guard';
import { DashboardAdmin } from './Paginas/privadas/dashboard-admin/dashboard-admin';
import { DashboardUsuario } from './Paginas/privadas/dashboard-usuario/dashboard-usuario';
import { inicioGuard } from './Auth/inicio.guard';
export const routes: Routes = [

   {
    path: 'login',
    component: LoginCompents,
    canActivate: [
      inicioGuard
    ]
  },
  { path: 'admin',
    canActivate: [
      authGuard,
      rolGuard
    ],
    data: {rol: 'ADMIN'},
    children: [
      {path: 'dashboard',component: DashboardAdmin},
    ]
  },
  {path: 'usuario',
    canActivate: [
      authGuard,
      rolGuard
    ],
    data: {
      rol: 'USUARIO'
    },
    children: [
      { path: 'dashboard', component: DashboardUsuario}
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'  },
  { path: '**', redirectTo: 'login'}
];
