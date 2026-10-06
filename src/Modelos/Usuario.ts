import { Cliente } from './Cliente';

export interface Usuario {

  id?: number;

  username: string;

  password?: string;

  activo: boolean;

  rol: 'ADMIN' | 'USUARIO';

  cliente: Cliente | null;
}