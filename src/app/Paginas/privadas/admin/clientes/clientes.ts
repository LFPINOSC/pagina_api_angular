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
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  cargando = false;
  mensaje = '';
  error = '';
  tipoBusqueda = 'id';
  textoBusqueda = '';
  mostrarFormulario = false;
  modoFormulario: 'crear' | 'editar' = 'crear';
  guardando = false;
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

  listarClientes(): void {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';
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
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(
            'ERROR AL LISTAR CLIENTES:',
            err
          );
          this.clientes = [];
          this.cargando = false;
          this.mostrarError(err);
          this.cdr.detectChanges();
        }
      });

  }

  buscar(): void {
    this.mensaje = '';
    this.error = '';
    const valor =
      this.textoBusqueda.trim();
    if (!valor) {
      this.listarClientes();
      return;
    }
    if (this.tipoBusqueda === 'id') {
      const id = Number(valor);
      if (
        isNaN(id) ||
        id <= 0
      ) {
        this.error =
          'Ingrese un ID válido.';
        return;
      }
      this.cargando = true;
      this.clienteServicio
        .buscarIdCliente(id)
        .pipe(
          timeout(10000)
        )
        .subscribe({
          next: (cliente) => {
            this.clientes = [
              cliente
            ];
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
      return;
    }
    if (this.tipoBusqueda === 'cedula') {
      this.cargando = true;
      this.clienteServicio
        .buscarCedulaCliente(valor)
        .pipe(
          timeout(10000)
        )
        .subscribe({
          next: (cliente) => {
            this.clientes = [
              cliente
            ];
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
      return;
    }
    if (
      this.tipoBusqueda === 'direccion'
    ) {
      this.cargando = true;
      this.clienteServicio
        .buscarDireccionCliente(valor)
        .pipe(
          timeout(10000)
        )
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
  }

  mostrarTodos(): void {
    this.textoBusqueda = '';
    this.listarClientes();
  }

  nuevoCliente(): void {
    this.modoFormulario = 'crear';
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

  editarCliente(
    cliente: Cliente
  ): void {
    this.modoFormulario = 'editar';
    this.clienteForm = {
      ...cliente
    };
    this.mensaje = '';
    this.error = '';
    this.mostrarFormulario = true;
  }
 cerrarFormulario(): void {
    if (this.guardando) {
      return;
    }
    this.mostrarFormulario = false;
  }

  guardarCliente(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.clienteForm.cedula ||
      !this.clienteForm.cedula.trim()
    ) {
      this.error =
        'Ingrese la cédula del cliente.';
      return;
    }

    if (
      !this.clienteForm.nombre ||
      !this.clienteForm.nombre.trim()
    ) {
      this.error =
        'Ingrese el nombre del cliente.';
      return;
    }
   if (
      !this.clienteForm.direccion ||
      !this.clienteForm.direccion.trim()
    ) {
      this.error =
        'Ingrese la dirección del cliente.';
      return;
    }

    this.guardando = true;
    if (
      this.modoFormulario === 'crear'
    ) {
      const nuevoCliente: Cliente = {
        ...this.clienteForm,
        id: undefined
      };
      this.clienteServicio
        .guardarCliente(nuevoCliente)
        .pipe(
          timeout(10000)
        )
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
              'Error al crear cliente:',
              err
            );
            this.guardando = false;
            this.mostrarError(err);
            this.cdr.detectChanges();
          }
        });
    }
    else {
      if (
        this.clienteForm.id == null
      ) {
        this.guardando = false;
        this.error =
          'No se encontró el ID del cliente.';
        return;
      }
      this.clienteServicio
        .actualizarCliente(
          this.clienteForm.id,
          this.clienteForm
        )
        .pipe(
          timeout(10000)
        )
        .subscribe({
          next: (cliente) => {
            console.log(
              'Cliente actualizado:',
              cliente
            );
            this.guardando = false;
            this.mostrarFormulario = false;
            this.mensaje =
              'Cliente actualizado correctamente.';
            this.listarClientes();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(
              'Error al actualizar cliente:',
              err
            );
            this.guardando = false;
            this.mostrarError(err);
            this.cdr.detectChanges();
          }
        });
    }
  }
  verDetalle(
    cliente: Cliente
  ): void {
    this.clienteSeleccionado =
      cliente;
  }
  cerrarDetalle(): void {
    this.clienteSeleccionado =
      null;
  }
  eliminarCliente(
    cliente: Cliente
  ): void {
    if (cliente.id == null) {
      return;
    }
    const confirmar = confirm(
      `¿Está seguro de eliminar al cliente "${cliente.nombre}"?`
    );
    if (!confirmar) {
      return;
    }

    this.clienteServicio
      .eliminarCliente(
        cliente.id
      )
      .pipe(
        timeout(10000)
      )
      .subscribe({
        next: () => {
          this.clientes =
            this.clientes.filter(
              c => c.id !== cliente.id
            );
          this.mensaje =
            'Cliente eliminado correctamente.';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(
            'Error al eliminar cliente:',
            err
          );
          this.mostrarError(err);
          this.cdr.detectChanges();
        }
      });
  }
  private mostrarError(
    err: any
  ): void {
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
        'Sesión no válida. Vuelva a iniciar sesión.';
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
        'El cliente ya existe o está siendo utilizado.';
      return;
    }
    if (err?.status === 0) {
      this.error =
        'No se puede conectar con el servidor Spring Boot.';
      return;
    }
    if (err?.status === 500) {
      this.error =
        err?.error?.message ??
        'Error interno del servidor.';
      return;
    }
    this.error =
      'No se pudo realizar la operación.';
  }
}