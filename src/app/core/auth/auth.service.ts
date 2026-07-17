import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { UsuariosService } from '../../modules/usuarios/services/usuarios.service';
import { inicialesUsuario, nombreCompletoUsuario } from '../../modules/usuarios/models/usuario.model';

export interface ResultadoLogin {
  exito: boolean;
  error?: string;
}

/**
 * Autenticación mock: sin backend, "iniciar sesión" es válido si el
 * email coincide con un usuario activo de `UsuariosService`. La
 * contraseña no se verifica (no hay nada contra qué verificarla en un
 * proyecto sin API), pero el formulario de login sigue pidiéndola para
 * que la experiencia sea realista y quede claro dónde se conecta el
 * backend real más adelante.
 *
 * Vive en `core/auth` (no en `modules/usuarios`) porque autenticación es
 * una responsabilidad transversal de toda la app, aunque dependa de los
 * datos de ese módulo — el mismo tipo de dependencia intencional que ya
 * usan Turnos/Tratamientos/Facturación hacia Pacientes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuariosService = inject(UsuariosService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  iniciarSesion(email: string): ResultadoLogin {
    const usuario = this.usuariosService.buscarPorEmail(email);

    if (!usuario) {
      return { exito: false, error: 'No existe un usuario con ese email.' };
    }
    if (!usuario.activo) {
      return { exito: false, error: 'Este usuario está desactivado. Contactá a un administrador.' };
    }

    this.sessionService.iniciarSesion({
      id: usuario.id,
      nombreCompleto: nombreCompletoUsuario(usuario),
      rol: usuario.rol,
      iniciales: inicialesUsuario(usuario),
    });

    return { exito: true };
  }

  cerrarSesion(): void {
    this.sessionService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}