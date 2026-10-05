import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../Modelos/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  private urlApi="http://localhost:8080/api/usuarios"
  constructor(private http:HttpClient) {}
  listarUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlApi);
  }
  buscarIdUsuario(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(this.urlApi+"/"+id);
  }
  guardarUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.urlApi, usuario);
  }
}
