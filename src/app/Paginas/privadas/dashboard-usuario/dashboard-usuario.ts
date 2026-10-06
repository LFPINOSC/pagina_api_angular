import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServicio } from '../../../Servicios/auth-servicio';

@Component({
  selector: 'app-dashboard-usuario',
  imports: [],
  templateUrl: './dashboard-usuario.html',
  styleUrl: './dashboard-usuario.css'
})
export class DashboardUsuario {

  username: string | null = null;

  constructor(
    private authServicio: AuthServicio,
    private router: Router
  ) {

    this.username = this.authServicio.getUsername();

  }irPerfil(): void {

    this.router.navigate([
      '/usuario/perfil'
    ]);

  }irClientes(): void {

    this.router.navigate([
      '/usuario/clientesuasuario'
    ]);

  }cerrarSesion(): void {

    this.authServicio.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
