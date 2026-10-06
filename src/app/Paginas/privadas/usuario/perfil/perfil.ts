import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';
import { Usuario } from '../../../../../Modelos/Usuario';
import { UsuarioServicio } from '../../../../Servicios/usuario-servicio';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  usuario: Usuario | null = null;

  cargando = false;

  guardando = false;

  mensaje = '';

  error = '';

  nuevaPassword = '';


  constructor(
    private usuarioServicio: UsuarioServicio,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarPerfil();

  }


  // ==============================================
  // CARGAR PERFIL
  // ==============================================

  cargarPerfil(): void {

    this.cargando = true;

    this.mensaje = '';

    this.error = '';

    this.usuarioServicio
      .obtenerPerfil()
      .pipe(timeout(10000))
      .subscribe({

        next: (usuario) => {

          console.log(
            'Perfil recibido:',
            usuario
          );

          this.usuario = usuario;

          this.cargando = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al cargar perfil:',
            err
          );

          this.cargando = false;

          this.mostrarError(err);

          this.cdr.detectChanges();

        }

      });

  }


  // ==============================================
  // GUARDAR
  // ==============================================

  guardarPerfil(): void {

    if (!this.usuario) {

      return;

    }


    this.mensaje = '';

    this.error = '';


    if (!this.usuario.username?.trim()) {

      this.error =
        'El nombre de usuario es obligatorio.';

      return;

    }


    if (
      this.nuevaPassword &&
      this.nuevaPassword.length < 6
    ) {

      this.error =
        'La nueva contraseña debe tener al menos 6 caracteres.';

      return;

    }


    this.guardando = true;


    const datos: Usuario = {

      id: this.usuario.id,

      username:
        this.usuario.username,

      password:
        this.nuevaPassword,

      activo:
        this.usuario.activo,

      rol:
        this.usuario.rol,

      cliente:
        this.usuario.cliente

    };


    this.usuarioServicio
      .actualizarPerfil(datos)
      .pipe(timeout(10000))
      .subscribe({

        next: (usuarioActualizado) => {

          console.log(
            'Perfil actualizado:',
            usuarioActualizado
          );

          this.usuario =
            usuarioActualizado;

          this.nuevaPassword = '';

          this.guardando = false;

          this.mensaje =
            'Perfil actualizado correctamente.';

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al actualizar perfil:',
            err
          );

          this.guardando = false;

          this.mostrarError(err);

          this.cdr.detectChanges();

        }

      });

  }


  // ==============================================
  // ERROR
  // ==============================================

  private mostrarError(err: any): void {

    if (err?.name === 'TimeoutError') {

      this.error =
        'El servidor no respondió después de 10 segundos.';

      return;

    }


    if (err?.status === 400) {

      this.error =
        err?.error?.message ??
        'Los datos enviados no son válidos.';

      return;

    }


    if (err?.status === 401) {

      this.error =
        'La sesión no es válida.';

      return;

    }


    if (err?.status === 403) {

      this.error =
        'No tiene permisos para modificar el perfil.';

      return;

    }


    if (err?.status === 404) {

      this.error =
        'No se encontró el usuario.';

      return;

    }


    if (err?.status === 409) {

      this.error =
        'El nombre de usuario ya está siendo utilizado.';

      return;

    }


    if (err?.status === 0) {

      this.error =
        'No se puede conectar con el servidor.';

      return;

    }


    this.error =
      'No se pudo actualizar el perfil.';

  }

}