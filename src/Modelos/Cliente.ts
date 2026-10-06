export interface Cliente {
  id?: number;
  cedula: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  correo?: string;
}