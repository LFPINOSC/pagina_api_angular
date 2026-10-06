import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';

import { ClienteServicio } from '../../../../Servicios/cliente-servicio';
import { Cliente } from '../../../../../Modelos/Cliente';

@Component({
  selector: 'app-clientes-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './clientes-usuario.html',
  styleUrl: './clientes-usuario.css'
})
export class ClientesUsuario implements OnInit {

  clientes: Cliente[] = [];

  cargando = false;

  guardando = false;

  mensaje = '';

  error = '';

  // Búsqueda
  tipoBusqueda = 'cedula';

  textoBusqueda = '';

  // Formulario
  mostrarFormulario = false;

  clienteSeleccionado: Cliente | null = null;

  clienteForm: Cliente = {
    id: undefined,
    cedula: '',
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  };


  constructor(
    private clienteServicio: ClienteServicio,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.listarClientes();
  }


  // =====================================================
  // LISTAR CLIENTES
  // =====================================================

  listarClientes(): void {

    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    console.log('Consultando clientes...');

    this.clienteServicio
      .listarClientes()
      .pipe(timeout(10000))
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Clientes recibidos:',
            respuesta
          );

          this.clientes = respuesta;

          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Error al listar clientes:',
            err
          );

          this.clientes = [];

          this.cargando = false;

          this.mostrarError(err);

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // BUSCAR
  // =====================================================

  buscar(): void {

    const valor = this.textoBusqueda.trim();

    this.mensaje = '';
    this.error = '';

    if (!valor) {

      this.listarClientes();

      return;
    }


    // ---------------------------------------------------
    // BUSCAR POR CÉDULA
    // ---------------------------------------------------

    if (this.tipoBusqueda === 'cedula') {

      this.buscarPorCedula(valor);

      return;
    }


    // ---------------------------------------------------
    // BUSCAR POR ID
    // ---------------------------------------------------

    if (this.tipoBusqueda === 'id') {

      const id = Number(valor);

      if (isNaN(id) || id <= 0) {

        this.error =
          'Ingrese un ID válido.';

        return;
      }

      this.buscarPorId(id);

      return;
    }


    // ---------------------------------------------------
    // BUSCAR POR DIRECCIÓN
    // ---------------------------------------------------

    if (this.tipoBusqueda === 'direccion') {

      this.buscarPorDireccion(valor);

    }
  }


  // =====================================================
  // BUSCAR ID
  // =====================================================

  buscarPorId(id: number): void {

    this.cargando = true;

    this.clienteServicio
      .buscarIdCliente(id)
      .pipe(timeout(10000))
      .subscribe({

        next: (cliente) => {

          this.clientes = [cliente];

          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          this.clientes = [];

          this.cargando = false;

          if (err.status === 404) {

            this.error =
              'No se encontró el cliente.';

          } else {

            this.mostrarError(err);

          }

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // BUSCAR CÉDULA
  // =====================================================

  buscarPorCedula(cedula: string): void {

    this.cargando = true;

    this.clienteServicio
      .buscarCedulaCliente(cedula)
      .pipe(timeout(10000))
      .subscribe({

        next: (cliente) => {

          this.clientes = [cliente];

          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          this.clientes = [];

          this.cargando = false;

          if (err.status === 404) {

            this.error =
              'No se encontró un cliente con esa cédula.';

          } else {

            this.mostrarError(err);

          }

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // BUSCAR DIRECCIÓN
  // =====================================================

  buscarPorDireccion(
    direccion: string
  ): void {

    this.cargando = true;

    this.clienteServicio
      .buscarDireccionCliente(direccion)
      .pipe(timeout(10000))
      .subscribe({

        next: (respuesta) => {

          this.clientes = respuesta;

          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          this.clientes = [];

          this.cargando = false;

          this.mostrarError(err);

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // MOSTRAR TODOS
  // =====================================================

  mostrarTodos(): void {

    this.textoBusqueda = '';

    this.listarClientes();
  }


  // =====================================================
  // NUEVO CLIENTE
  // =====================================================

  nuevoCliente(): void {

    this.clienteForm = {

      id: undefined,

      cedula: '',

      nombre: '',

      direccion: '',

      telefono: '',

      correo: ''

    };

    this.mensaje = '';

    this.error = '';

    this.mostrarFormulario = true;
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
  // GUARDAR CLIENTE
  // =====================================================

  guardarCliente(): void {

    this.mensaje = '';

    this.error = '';


    // Validaciones

    if (!this.clienteForm.cedula?.trim()) {

      this.error =
        'Ingrese la cédula del cliente.';

      return;
    }


    if (!this.clienteForm.nombre?.trim()) {

      this.error =
        'Ingrese el nombre del cliente.';

      return;
    }


    if (!this.clienteForm.direccion?.trim()) {

      this.error =
        'Ingrese la dirección del cliente.';

      return;
    }


    this.guardando = true;


    const clienteNuevo: Cliente = {

      ...this.clienteForm,

      id: undefined

    };


    this.clienteServicio
      .guardarCliente(clienteNuevo)
      .pipe(timeout(10000))
      .subscribe({

        next: (cliente) => {

          console.log(
            'Cliente creado:',
            cliente
          );

          this.guardando = false;

          this.mostrarFormulario = false;

          this.mensaje =
            'Cliente registrado correctamente.';

          this.listarClientes();

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Error al registrar cliente:',
            err
          );

          this.guardando = false;

          this.mostrarError(err);

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // VER DETALLE
  // =====================================================

  verDetalle(cliente: Cliente): void {

    this.clienteSeleccionado = cliente;
  }


  // =====================================================
  // CERRAR DETALLE
  // =====================================================

  cerrarDetalle(): void {

    this.clienteSeleccionado = null;
  }


  // =====================================================
  // ERRORES
  // =====================================================

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
        'La sesión no es válida. Vuelva a iniciar sesión.';

      return;
    }


    if (err?.status === 403) {

      this.error =
        'No tiene permisos para realizar esta operación.';

      return;
    }


    if (err?.status === 404) {

      this.error =
        'No se encontró el cliente.';

      return;
    }


    if (err?.status === 409) {

      this.error =
        'El cliente ya existe.';

      return;
    }


    if (err?.status === 0) {

      this.error =
        'No se puede conectar con Spring Boot.';

      return;
    }


    this.error =
      'No se pudo realizar la operación.';
  }

}