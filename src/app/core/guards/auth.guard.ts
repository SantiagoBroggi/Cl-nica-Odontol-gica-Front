import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

/**
 * Protege todas las rutas de negocio (todo lo que cuelga del `ShellComponent`).
 * Si no hay sesión iniciada, redirige a `/login` en vez de dejar pasar.
 *
 * Se implementa como guard funcional (`CanActivateFn`), el estilo
 * recomendado desde Angular 15+ para standalone components, en vez de
 * una clase que implementa `CanActivate`.
 */
export const authGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};