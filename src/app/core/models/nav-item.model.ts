/**
 * Representa un ítem del menú lateral (sidebar) de la aplicación.
 *
 * Se modela como interfaz independiente (y no acoplada a Angular Router)
 * para poder reutilizarla en tests, breadcrumbs o un futuro menú dinámico
 * basado en permisos de usuario (ver core/guards en etapas posteriores).
 */
export interface NavItem {
  /** Texto visible en el sidebar. */
  label: string;
  /** Ruta absoluta a la que navega (coincide con app.routes.ts). */
  route: string;
  /** Nombre del ícono de Material Symbols/Icons a utilizar. */
  icon: string;
  /**
   * Roles habilitados para ver este ítem. Si se omite, es visible para
   * cualquier usuario autenticado. Se utilizará a partir de la Etapa 10
   * (Usuarios y seguridad) junto con los guards de permisos.
   */
  roles?: Array<'admin' | 'odontologo' | 'recepcionista'>;
  /** Badge numérico opcional (ej: notificaciones o turnos pendientes). */
  badge?: number;
}
