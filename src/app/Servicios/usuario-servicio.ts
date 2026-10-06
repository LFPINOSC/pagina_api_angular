
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Usuario } from '../../Modelos/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServicio {

  private urlApi = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<Usuario[]> {

    return this.http.get<Usuario[]>(
      this.urlApi
    );
  }

  buscarIdUsuario(id: number): Observable<Usuario> {

    return this.http.get<Usuario>(
      `${this.urlApi}/${id}`
    );
  }

  cambiarEstado(
    id: number,
    activo: boolean
  ): Observable<Usuario> {

    const params = new HttpParams()
      .set('activo', activo.toString());

    return this.http.put<Usuario>(
      `${this.urlApi}/${id}/estado`,
      null,
      { params }
    );
  }

  cambiarRol(
    id: number,
    rol: string
  ): Observable<Usuario> {

    const params = new HttpParams()
      .set('rol', rol);

    return this.http.put<Usuario>(
      `${this.urlApi}/${id}/rol`,
      null,
      { params }
    );
  }

  asociarCliente(
    usuarioId: number,
    clienteId: number
  ): Observable<Usuario> {

    return this.http.put<Usuario>(
      `${this.urlApi}/${usuarioId}/cliente/${clienteId}`,
      null
    );
  }
  crearUsuario(usuario: Usuario): Observable<Usuario> {

    return this.http.post<Usuario>(
      this.urlApi,
      usuario
    );

  }
  obtenerPerfil(): Observable<Usuario> {

      return this.http.get<Usuario>(
        `${this.urlApi}/perfil`
      );

    }
    actualizarPerfil(
    usuario: Usuario
  ): Observable<Usuario> {

    return this.http.put<Usuario>(
      `${this.urlApi}/perfil`,
      usuario
    );

  }
  desvincularCliente(
    usuarioId: number
  ): Observable<Usuario> {

    return this.http.delete<Usuario>(
      `${this.urlApi}/${usuarioId}/cliente`
    );
  }

  eliminarUsuario(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.urlApi}/${id}`
    );
  }

}
