import { Injectable, signal } from '@angular/core';
import { UsuarioSesion } from '../models/usuario-sesion.model';

/**
 * Fuente de verdad del usuario autenticado actual.
 *
 * Hasta la Etapa 10 exponía un usuario mock fijo, siempre "logueado",
 * para poder construir la navbar sin esperar al login real. Ahora que
 * `core/auth/auth.service.ts` existe, arranca sin sesión iniciada
 * (`estaAutenticado` en `false`) y es `AuthService` quien la completa
 * tras un login válido, vía `iniciarSesion()`.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _usuarioActual = signal<UsuarioSesion>({
    id: '',
    nombreCompleto: '',
    rol: 'recepcionista',
    iniciales: '',
  });
  private readonly _estaAutenticado = signal<boolean>(false);

  /** Signal de solo lectura con el usuario conectado. */
  readonly usuarioActual = this._usuarioActual.asReadonly();

  /** Indica si hay una sesión iniciada. La consulta `authGuard` antes de cada navegación. */
  readonly estaAutenticado = this._estaAutenticado.asReadonly();

  /** Cantidad de notificaciones sin leer (mock, ver Etapa 2). */
  readonly notificacionesSinLeer = signal<number>(3);

  iniciarSesion(usuario: UsuarioSesion): void {
    this._usuarioActual.set(usuario);
    this._estaAutenticado.set(true);
  }

  cerrarSesion(): void {
    this._estaAutenticado.set(false);
  }
}