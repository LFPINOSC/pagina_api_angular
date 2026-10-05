import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../Modelos/Cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteServicio {

  private urlApi="http://localhost:8080/api/clientes"
  constructor(private http:HttpClient) {}

  listarClientes():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.urlApi);
  }
  buscarIdCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(this.urlApi+"/"+id);
  }
  guardarCliente(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.urlApi, cliente);
  }
}
