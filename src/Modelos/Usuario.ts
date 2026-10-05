import { Cliente } from "./Cliente";

export interface Usuario{
    id:number;
    username:String;
    password:String;
    estado:boolean;
    rol:String;
    cliente:Cliente;
}
