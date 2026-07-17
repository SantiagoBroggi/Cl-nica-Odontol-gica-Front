import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { RolUsuario } from '../models/usuario-sesion.model';

/**
 * Restringe una ruta a los roles listados en `route.data['rolesPermitidos']`.
 * Si la ruta no declara esa data, deja pasar (no todas las rutas
 * necesitan restricción de rol, solo cosas como `/usuarios`).
 *
 * Se usa junto a `authGuard` (no en su reemplazo): `authGuard` ya
 * garantiza que hay una sesión iniciada antes de que este guard lea
 * `usuarioActual()`.
 */
export const rolGuard: CanActivateFn = (route) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  const rolesPermitidos = route.data['rolesPermitidos'] as RolUsuario[] | undefined;

  if (!rolesPermitidos || rolesPermitidos.includes(sessionService.usuarioActual().rol)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};