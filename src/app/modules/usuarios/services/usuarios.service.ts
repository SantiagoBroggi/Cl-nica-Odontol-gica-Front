import { Injectable, computed, signal } from '@angular/core';
import { Usuario, UsuarioFormValue } from '../models/usuario.model';

/**
 * Fuente de datos de Usuarios (quienes pueden iniciar sesión).
 *
 * Los dos odontólogos de acá son intencionalmente los mismos nombres que
 * `PROFESIONALES` en `modules/turnos/models/turno.model.ts` — en un
 * sistema real esa lista debería derivar de estos usuarios (todo
 * profesional que atiende es también un usuario del sistema), pero
 * mantenerlas separadas por ahora evita acoplar Turnos a Usuarios antes
 * de que este módulo existiera.
 */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly _usuarios = signal<Usuario[]>(this.datosIniciales());
  readonly usuarios = this._usuarios.asReadonly();

  readonly usuariosActivos = computed(() => this._usuarios().filter((u) => u.activo));

  obtenerPorId(id: string): Usuario | undefined {
    return this._usuarios().find((u) => u.id === id);
  }

  buscarPorEmail(email: string): Usuario | undefined {
    const normalizado = email.trim().toLowerCase();
    return this._usuarios().find((u) => u.email.toLowerCase() === normalizado);
  }

  crear(valores: UsuarioFormValue): void {
    const nuevo: Usuario = { id: crypto.randomUUID(), creadoEl: new Date(), ...valores };
    this._usuarios.update((lista) => [...lista, nuevo]);
  }

  actualizar(id: string, valores: UsuarioFormValue): void {
    this._usuarios.update((lista) => lista.map((u) => (u.id === id ? { ...u, ...valores } : u)));
  }

  eliminar(id: string): void {
    this._usuarios.update((lista) => lista.filter((u) => u.id !== id));
  }

  toggleActivo(id: string): void {
    this._usuarios.update((lista) => lista.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)));
  }

  private datosIniciales(): Usuario[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

    return [
      { id: 'u-1', nombre: 'Ana', apellido: 'Administradora', email: 'admin@dentalcare.com', rol: 'admin', activo: true, creadoEl: dias(-900) },
      { id: 'u-2', nombre: 'Lucía', apellido: 'Fernández', email: 'lucia.fernandez@dentalcare.com', rol: 'odontologo', activo: true, creadoEl: dias(-800) },
      { id: 'u-3', nombre: 'Martín', apellido: 'Suárez', email: 'martin.suarez@dentalcare.com', rol: 'odontologo', activo: true, creadoEl: dias(-600) },
      { id: 'u-4', nombre: 'Carla', apellido: 'Recepción', email: 'recepcion@dentalcare.com', rol: 'recepcionista', activo: true, creadoEl: dias(-400) },
    ];
  }
}