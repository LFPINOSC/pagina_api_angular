import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../Modelos/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteServicio {

  private urlApi = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlApi);
  }

  buscarIdCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.urlApi}/id/${id}`
    );
  }

  buscarCedulaCliente(cedula: string): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.urlApi}/cedula/${cedula}`
    );
  }

  buscarDireccionCliente(
    direccion: string
  ): Observable<Cliente[]> {

    return this.http.get<Cliente[]>(
      `${this.urlApi}/direccion/${encodeURIComponent(direccion)}`
    );
  }

  guardarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.urlApi,
      cliente
    );
  }

  actualizarCliente(
    id: number,
    cliente: Cliente
  ): Observable<Cliente> {

    return this.http.put<Cliente>(
      `${this.urlApi}/id/${id}`,
      cliente
    );
  }

  eliminarCliente(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.urlApi}/id/${id}`
    );
  }
}