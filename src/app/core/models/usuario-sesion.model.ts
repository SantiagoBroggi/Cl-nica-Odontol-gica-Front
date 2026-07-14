/**
 * Datos mínimos del usuario autenticado que necesita la UI (navbar, avatar,
 * chip de rol, saludo). El modelo de dominio completo del usuario (con
 * matrícula profesional, especialidad, etc.) vive en
 * modules/usuarios/models, ya que pertenece a ese módulo de negocio.
 *
 * Este modelo "liviano" evita que core/ (transversal) dependa de modules/
 * (de negocio), respetando la regla de que los módulos no se importan
 * entre sí ni desde core.
 */
export type RolUsuario = 'admin' | 'odontologo' | 'recepcionista';

export interface UsuarioSesion {
  id: string;
  nombreCompleto: string;
  rol: RolUsuario;
  avatarUrl?: string;
  iniciales: string;
}

/** Etiquetas legibles para cada rol, usadas en el chip de la navbar. */
export const ROL_LABELS: Record<RolUsuario, string> = {
  admin: 'Administrador',
  odontologo: 'Odontólogo/a',
  recepcionista: 'Recepcionista',
};
