import { Component } from '@angular/core';
import { AuthServicio } from '../../../Servicios/auth-servicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-usuario',
  imports: [],
  templateUrl: './dashboard-usuario.html',
  styleUrl: './dashboard-usuario.css',
})
export class DashboardUsuario {
  username: string | null = null;
  constructor(
    private authServicio: AuthServicio,
    private router: Router
  ) {
    this.username =
      this.authServicio.getUsername();

  }
  irPerfil(): void {
    this.router.navigate([
      '/usuario/perfil'
    ]);

  }
  irClientes(): void {
    this.router.navigate([
      '/clientes'
    ]);

  }

  cerrarSesion(): void {

    this.authServicio.logout();

    this.router.navigate([
      '/login'
    ]);

  }
}
