import { RolUsuario } from '../../../core/models/usuario-sesion.model';

/**
 * Modelo de dominio de un usuario del sistema (quien puede iniciar
 * sesión), distinto de `Paciente`. Reutiliza el tipo `RolUsuario` de
 * `core/models` en vez de redefinirlo, porque `SessionService` (Etapa 1)
 * ya lo usa para el usuario conectado en la navbar.
 */
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEl: Date;
}

/** Forma de los datos que vienen del formulario reactivo de alta/edición. */
export type UsuarioFormValue = Pick<Usuario, 'nombre' | 'apellido' | 'email' | 'rol' | 'activo'>;

export const ROL_USUARIO_LABELS: Record<RolUsuario, string> = {
  admin: 'Administrador',
  odontologo: 'Odontólogo/a',
  recepcionista: 'Recepcionista',
};

export function nombreCompletoUsuario(usuario: Usuario): string {
  return `${usuario.nombre} ${usuario.apellido}`;
}

export function inicialesUsuario(usuario: Usuario): string {
  return `${usuario.nombre.trim().charAt(0)}${usuario.apellido.trim().charAt(0)}`.toUpperCase();
}