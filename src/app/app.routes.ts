import { Routes } from '@angular/router';
import { LoginCompents } from './Paginas/publicas/login-compents/login-compents';
import { authGuard } from './Auth/auth.guard';
import { rolGuard } from './Auth/rol.guard';
import { DashboardAdmin } from './Paginas/privadas/dashboard-admin/dashboard-admin';
import { DashboardUsuario } from './Paginas/privadas/dashboard-usuario/dashboard-usuario';
import { inicioGuard } from './Auth/inicio.guard';
import { Usuarios } from './Paginas/privadas/admin/usuarios/usuarios';
import { Clientes } from './Paginas/privadas/admin/clientes/clientes';
import { Reportes } from './Paginas/privadas/admin/reportes/reportes';
import { Perfil } from './Paginas/privadas/usuario/perfil/perfil';
import { ClientesUsuario } from './Paginas/privadas/usuario/clientes-usuario/clientes-usuario';
export const routes: Routes = [

   {
    path: 'login',
    component: LoginCompents,
    canActivate: [
      inicioGuard
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, rolGuard],
    data: { rol: 'ADMIN' },
    children: [
      {
        path: 'dashboard',
        component: DashboardAdmin
      },
      {
        path: 'usuarios',
        component: Usuarios
      },
      {
        path: 'clientes',
        component: Clientes
      },
      {
        path: 'reportes',
        component: Reportes
      }
    ]
  },
  {
    path: 'usuario',
    canActivate: [authGuard, rolGuard],
    data: { rol: 'USUARIO' },
    children: [
      {
        path: 'dashboard',
        component: DashboardUsuario
      },
      {
        path: 'perfil',
        component: Perfil
      },
      {
        path: 'clientesuasuario',
        component: ClientesUsuario
      }
    ]
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full'  },
  { path: '**', redirectTo: 'login'}
];
