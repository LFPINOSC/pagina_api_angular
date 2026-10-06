import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServicio } from '../../../Servicios/auth-servicio';

@Component({
  selector: 'app-dashboard-admin',
  imports: [],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin {

  username: string | null = null;

  constructor(
    private authServicio: AuthServicio,
    private router: Router
  ) {

    this.username = this.authServicio.getUsername();

  }

  // ==========================================
  // ADMINISTRAR USUARIOS
  // ==========================================

  irUsuarios(): void {

    this.router.navigate([
      '/admin/usuarios'
    ]);

  }

  // ==========================================
  // ADMINISTRAR CLIENTES
  // ==========================================

  irClientes(): void {

    this.router.navigate([
      '/admin/clientes'
    ]);

  }

  // ==========================================
  // REPORTES
  // ==========================================

  irReportes(): void {

    this.router.navigate([
      '/admin/reportes'
    ]);

  }

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  cerrarSesion(): void {

    this.authServicio.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
