import { Injectable, signal } from '@angular/core';
import { UsuarioSesion } from '../models/usuario-sesion.model';

/**
 * Fuente de verdad del usuario autenticado actual.
 *
 * Hoy expone un usuario mock fijo para poder construir la navbar y, más
 * adelante, los guards de permisos, sin esperar a que el backend
 * (FastAPI + JWT) esté disponible. En la Etapa 10 este servicio pasará a
 * hidratarse desde `core/auth/auth.service.ts` tras el login real,
 * manteniendo la misma interfaz pública (`usuarioActual`), por lo que los
 * componentes que ya lo consuman (navbar, guards) no deberían requerir
 * cambios.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _usuarioActual = signal<UsuarioSesion>({
    id: 'mock-user-1',
    nombreCompleto: 'Dra. Lucía Fernández',
    rol: 'odontologo',
    iniciales: 'LF',
  });

  /** Signal de solo lectura con el usuario conectado. */
  readonly usuarioActual = this._usuarioActual.asReadonly();

  /** Cantidad de notificaciones sin leer (mock, se conectará en Etapa 2/10). */
  readonly notificacionesSinLeer = signal<number>(3);
}
