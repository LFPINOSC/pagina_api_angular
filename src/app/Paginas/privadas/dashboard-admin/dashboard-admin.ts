import { Component } from '@angular/core';
import { AuthServicio } from '../../../Servicios/auth-servicio';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-admin',
  imports: [],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin {
  username: string | null = null;
  constructor(
    private authServicio: AuthServicio,
    private router: Router
  ) {

    this.username =
      this.authServicio.getUsername();
  }

  irClientes(): void {
    this.router.navigate([
      '/admin/clientes'
    ]);
  }
  irUsuarios(): void {
    this.router.navigate([
      '/admin/usuarios'
    ]);

  }
  irReportes(): void {
    this.router.navigate([
      '/admin/reportes'
    ]);
  }
  cerrarSesion(): void {
    this.authServicio.logout();
    this.router.navigate([
      '/login'
    ]);
  }
}