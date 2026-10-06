import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';

import { UsuarioServicio } from '../../../../Servicios/usuario-servicio';
import { ClienteServicio } from '../../../../Servicios/cliente-servicio';

import { Usuario } from '../../../../../Modelos/Usuario';
import { Cliente } from '../../../../../Modelos/Cliente';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  // =====================================================
  // LISTADO
  // =====================================================

  usuarios: Usuario[] = [];

  cargando = false;

  mensaje = '';

  error = '';

  busquedaId = '';

  usuarioSeleccionado: Usuario | null = null;


  // =====================================================
  // NUEVO USUARIO
  // =====================================================

  mostrarFormulario = false;

  guardando = false;

  mostrarPassword = false;

  clientes: Cliente[] = [];

  cargandoClientes = false;


  nuevoUsuarioData = {
    username: '',
    password: '',
    rol: 'USUARIO' as 'ADMIN' | 'USUARIO',
    activo: true,
    clienteId: null as number | null
  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private usuarioServicio: UsuarioServicio,
    private clienteServicio: ClienteServicio,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    console.log('Inicializando administración de usuarios...');

    this.listarUsuarios();

  }


  // =====================================================
  // LISTAR USUARIOS
  // =====================================================

  listarUsuarios(): void {

    this.cargando = true;

    this.mensaje = '';

    this.error = '';

    console.log('Consultando usuarios...');

    this.usuarioServicio
      .listarUsuarios()
      .pipe(
        timeout(10000)
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Usuarios recibidos:',
            respuesta
          );

          this.usuarios = respuesta;

          this.cargando = false;

          console.log(
            'cargando después de recibir:',
            this.cargando
          );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'ERROR AL LISTAR USUARIOS:',
            err
          );

          this.usuarios = [];

          this.cargando = false;

          if (err.name === 'TimeoutError') {

            this.error =
              'El servidor no respondió después de 10 segundos.';

          }
          else if (err.status === 401) {

            this.error =
              'Sesión no válida. Vuelva a iniciar sesión.';

          }
          else if (err.status === 403) {

            this.error =
              'No tiene permisos para administrar usuarios.';

          }
          else if (err.status === 0) {

            this.error =
              'No se puede conectar con el servidor Spring Boot.';

          }
          else if (err.status === 500) {

            this.error =
              'Error interno del servidor.';

          }
          else {

            this.error =
              'No se pudieron cargar los usuarios.';

          }

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // BUSCAR POR ID
  // =====================================================

  buscarPorId(): void {

    this.mensaje = '';

    this.error = '';

    if (!this.busquedaId) {

      this.listarUsuarios();

      return;
    }

    const id = Number(this.busquedaId);

    if (isNaN(id) || id <= 0) {

      this.error =
        'Ingrese un ID válido.';

      return;
    }

    this.cargando = true;

    this.usuarioServicio
      .buscarIdUsuario(id)
      .pipe(
        timeout(10000)
      )
      .subscribe({

        next: (usuario) => {

          console.log(
            'Usuario encontrado:',
            usuario
          );

          this.usuarios = [usuario];

          this.cargando = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'ERROR AL BUSCAR USUARIO:',
            err
          );

          this.usuarios = [];

          this.cargando = false;

          if (err.status === 404) {

            this.error =
              'No se encontró el usuario.';

          }
          else if (err.status === 403) {

            this.error =
              'No tiene permisos para consultar usuarios.';

          }
          else if (err.status === 401) {

            this.error =
              'Sesión no válida.';

          }
          else {

            this.error =
              'No se pudo consultar el usuario.';

          }

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // MOSTRAR TODOS
  // =====================================================

  limpiarBusqueda(): void {

    this.busquedaId = '';

    this.listarUsuarios();

  }


  // =====================================================
  // ABRIR NUEVO USUARIO
  // =====================================================

  nuevoUsuario(): void {

    this.mensaje = '';

    this.error = '';

    this.nuevoUsuarioData = {

      username: '',

      password: '',

      rol: 'USUARIO',

      activo: true,

      clienteId: null

    };

    this.mostrarPassword = false;

    this.mostrarFormulario = true;

    // Cargar clientes
    this.listarClientes();

  }


  // =====================================================
  // CARGAR CLIENTES
  // =====================================================

  listarClientes(): void {

    this.cargandoClientes = true;

    console.log('Consultando clientes...');

    this.clienteServicio
      .listarClientes()
      .pipe(
        timeout(10000)
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Clientes recibidos:',
            respuesta
          );

          this.clientes = respuesta;

          this.cargandoClientes = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'ERROR AL LISTAR CLIENTES:',
            err
          );

          this.clientes = [];

          this.cargandoClientes = false;

          this.error =
            'No se pudieron cargar los clientes.';

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CERRAR FORMULARIO
  // =====================================================

  cerrarFormulario(): void {

    if (this.guardando) {

      return;

    }

    this.mostrarFormulario = false;

  }


  // =====================================================
  // MOSTRAR / OCULTAR PASSWORD
  // =====================================================

  cambiarVisibilidadPassword(): void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }


  // =====================================================
  // CAMBIO DE ROL
  // =====================================================

  cambioRol(): void {

    /*
     * Si cambia a ADMIN:
     * el cliente deja de ser obligatorio.
     */

    if (this.nuevoUsuarioData.rol === 'ADMIN') {

      this.nuevoUsuarioData.clienteId = null;

    }

  }


  // =====================================================
  // CREAR USUARIO
  // =====================================================

  crearUsuario(): void {

    this.mensaje = '';

    this.error = '';


    // -------------------------------------------------
    // VALIDAR USERNAME
    // -------------------------------------------------

    if (
      !this.nuevoUsuarioData.username ||
      !this.nuevoUsuarioData.username.trim()
    ) {

      this.error =
        'Ingrese el nombre de usuario.';

      return;

    }


    // -------------------------------------------------
    // VALIDAR PASSWORD
    // -------------------------------------------------

    if (
      !this.nuevoUsuarioData.password ||
      !this.nuevoUsuarioData.password.trim()
    ) {

      this.error =
        'Ingrese la contraseña.';

      return;

    }


    if (
      this.nuevoUsuarioData.password.length < 6
    ) {

      this.error =
        'La contraseña debe tener al menos 6 caracteres.';

      return;

    }


    // -------------------------------------------------
    // VALIDAR ROL
    // -------------------------------------------------

    if (!this.nuevoUsuarioData.rol) {

      this.error =
        'Seleccione un rol.';

      return;

    }


    // -------------------------------------------------
    // VALIDAR CLIENTE
    // -------------------------------------------------

    if (
      this.nuevoUsuarioData.rol === 'USUARIO' &&
      !this.nuevoUsuarioData.clienteId
    ) {

      this.error =
        'Debe seleccionar un cliente para el usuario.';

      return;

    }


    // -------------------------------------------------
    // BUSCAR CLIENTE SELECCIONADO
    // -------------------------------------------------

    let clienteSeleccionado: Cliente | null = null;

    if (this.nuevoUsuarioData.clienteId) {

      clienteSeleccionado =
        this.clientes.find(
          c => c.id === this.nuevoUsuarioData.clienteId
        ) ?? null;

    }


    // -------------------------------------------------
    // PREPARAR OBJETO
    // -------------------------------------------------

    const usuario: any = {

      username:
        this.nuevoUsuarioData.username.trim(),

      password:
        this.nuevoUsuarioData.password,

      rol:
        this.nuevoUsuarioData.rol,

      activo:
        this.nuevoUsuarioData.activo,

      cliente:
        clienteSeleccionado
          ? {
              id: clienteSeleccionado.id
            }
          : null

    };


    console.log(
      'Usuario a crear:',
      usuario
    );


    // -------------------------------------------------
    // GUARDAR
    // -------------------------------------------------

    this.guardando = true;

    this.usuarioServicio
      .crearUsuario(usuario)
      .pipe(
        timeout(10000)
      )
      .subscribe({

        next: (usuarioCreado) => {

          console.log(
            'Usuario creado:',
            usuarioCreado
          );

          this.guardando = false;

          this.mensaje =
            'Usuario creado correctamente.';

          this.mostrarFormulario = false;

          this.listarUsuarios();

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'ERROR AL CREAR USUARIO:',
            err
          );

          this.guardando = false;

          if (err.status === 400) {

            this.error =
              err.error?.message ??
              'Los datos del usuario no son válidos.';

          }
          else if (err.status === 401) {

            this.error =
              'Sesión no válida.';

          }
          else if (err.status === 403) {

            this.error =
              'No tiene permisos para crear usuarios.';

          }
          else if (err.status === 409) {

            this.error =
              'El nombre de usuario ya existe.';

          }
          else if (err.status === 0) {

            this.error =
              'No se puede conectar con Spring Boot.';

          }
          else if (err.status === 500) {

            this.error =
              err.error?.message ??
              'Error interno del servidor.';

          }
          else {

            this.error =
              'No se pudo crear el usuario.';

          }

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CAMBIAR ESTADO
  // =====================================================

  cambiarEstado(usuario: Usuario): void {

    if (usuario.id == null) {

      return;

    }

    const nuevoEstado =
      !usuario.activo;

    this.usuarioServicio
      .cambiarEstado(
        usuario.id,
        nuevoEstado
      )
      .subscribe({

        next: (usuarioActualizado) => {

          Object.assign(
            usuario,
            usuarioActualizado
          );

          this.mensaje =
            nuevoEstado
              ? 'Usuario activado correctamente.'
              : 'Usuario desactivado correctamente.';

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al cambiar estado:',
            err
          );

          this.error =
            'No se pudo cambiar el estado del usuario.';

        }

      });

  }


  // =====================================================
  // CAMBIAR ROL
  // =====================================================

  cambiarRol(usuario: Usuario): void {

    if (usuario.id == null) {

      return;

    }

    const nuevoRol =
      usuario.rol === 'ADMIN'
        ? 'USUARIO'
        : 'ADMIN';


    const confirmar = confirm(
      `¿Desea cambiar el rol de "${usuario.username}" a "${nuevoRol}"?`
    );


    if (!confirmar) {

      return;

    }


    /*
     * Si estamos convirtiendo a USUARIO y no tiene cliente,
     * el backend podría rechazarlo.
     */

    if (
      nuevoRol === 'USUARIO' &&
      !usuario.cliente
    ) {

      this.error =
        'No puede cambiar a USUARIO porque no tiene un cliente asociado.';

      return;

    }


    this.usuarioServicio
      .cambiarRol(
        usuario.id,
        nuevoRol
      )
      .subscribe({

        next: (usuarioActualizado) => {

          Object.assign(
            usuario,
            usuarioActualizado
          );

          this.mensaje =
            'Rol actualizado correctamente.';

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al cambiar rol:',
            err
          );

          this.error =
            err.error?.message ??
            'No se pudo cambiar el rol.';

        }

      });

  }


  // =====================================================
  // VER DETALLE
  // =====================================================

  seleccionarUsuario(
    usuario: Usuario
  ): void {

    this.usuarioSeleccionado =
      usuario;

    this.mensaje = '';

    this.error = '';

  }


  // =====================================================
  // CERRAR DETALLE
  // =====================================================

  cerrarDetalle(): void {

    this.usuarioSeleccionado =
      null;

  }


  // =====================================================
  // DESVINCULAR CLIENTE
  // =====================================================

  desvincularCliente(
    usuario: Usuario
  ): void {

    if (usuario.id == null) {

      return;

    }


    /*
     * Un USUARIO debe tener cliente.
     * Por eso no permitimos desvincularlo
     * si sigue siendo USUARIO.
     */

    if (usuario.rol === 'USUARIO') {

      this.error =
        'Un usuario con rol USUARIO debe tener un cliente asociado.';

      return;

    }


    const confirmar = confirm(
      '¿Desea desvincular el cliente de este usuario?'
    );


    if (!confirmar) {

      return;

    }


    this.usuarioServicio
      .desvincularCliente(
        usuario.id
      )
      .subscribe({

        next: (usuarioActualizado) => {

          Object.assign(
            usuario,
            usuarioActualizado
          );

          this.mensaje =
            'Cliente desvinculado correctamente.';

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al desvincular cliente:',
            err
          );

          this.error =
            err.error?.message ??
            'No se pudo desvincular el cliente.';

        }

      });

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminarUsuario(
    usuario: Usuario
  ): void {

    if (usuario.id == null) {

      return;

    }


    const confirmar = confirm(
      `¿Está seguro de eliminar al usuario "${usuario.username}"?`
    );


    if (!confirmar) {

      return;

    }


    this.usuarioServicio
      .eliminarUsuario(
        usuario.id
      )
      .subscribe({

        next: () => {

          this.usuarios =
            this.usuarios.filter(
              u => u.id !== usuario.id
            );

          this.mensaje =
            'Usuario eliminado correctamente.';

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error al eliminar usuario:',
            err
          );

          this.error =
            err.error?.message ??
            'No se pudo eliminar el usuario.';

        }

      });

  }


  // =====================================================
  // TEXTO ESTADO
  // =====================================================

  textoEstado(
    activo: boolean
  ): string {

    return activo
      ? 'Activo'
      : 'Inactivo';

  }

}