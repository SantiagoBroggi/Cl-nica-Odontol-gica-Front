import { Injectable, computed, inject, signal } from '@angular/core';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { nombreCompleto } from '../../pacientes/models/paciente.model';
import { Turno, TurnoFormValue, PROFESIONALES } from '../models/turno.model';
import { EstadoTurno } from '../../../shared/interfaces/estado-turno.interface';

/**
 * Fuente de datos de la Agenda.
 *
 * Inyecta `PacientesService` para armar los turnos mock sobre pacientes
 * reales (mismos IDs que ves en la Etapa 3), y para poblar el selector
 * de pacientes del formulario de alta. Es un acoplamiento intencional:
 * un turno *pertenece* a un paciente, a diferencia del caso del
 * dashboard, donde se usaban proyecciones livianas para no acoplar
 * módulos que no tienen una relación de dominio real.
 */
@Injectable({ providedIn: 'root' })
export class TurnosService {
  private readonly pacientesService = inject(PacientesService);

  private readonly _turnos = signal<Turno[]>(this.datosIniciales());
  readonly turnos = this._turnos.asReadonly();

  /** Pacientes disponibles para asignar en el formulario de turno. */
  readonly pacientesDisponibles = computed(() =>
    this.pacientesService.pacientesFiltrados().map((p) => ({ id: p.id, nombre: nombreCompleto(p) }))
  );

  readonly profesionales = PROFESIONALES;

  crear(valores: TurnoFormValue): void {
    const paciente = this.pacientesService.obtenerPorId(valores.pacienteId);
    const { inicio, fin } = this.calcularRango(valores.fecha, valores.hora, valores.duracionMinutos);

    const nuevo: Turno = {
      id: crypto.randomUUID(),
      pacienteId: valores.pacienteId,
      pacienteNombre: paciente ? nombreCompleto(paciente) : 'Paciente',
      motivo: valores.motivo,
      inicio,
      fin,
      profesional: valores.profesional,
      estado: valores.estado,
      notas: valores.notas,
    };

    this._turnos.update((lista) => [...lista, nuevo]);
  }

  actualizar(id: string, valores: TurnoFormValue): void {
    const paciente = this.pacientesService.obtenerPorId(valores.pacienteId);
    const { inicio, fin } = this.calcularRango(valores.fecha, valores.hora, valores.duracionMinutos);

    this._turnos.update((lista) =>
      lista.map((turno) =>
        turno.id === id
          ? {
              ...turno,
              pacienteId: valores.pacienteId,
              pacienteNombre: paciente ? nombreCompleto(paciente) : turno.pacienteNombre,
              motivo: valores.motivo,
              inicio,
              fin,
              profesional: valores.profesional,
              estado: valores.estado,
              notas: valores.notas,
            }
          : turno
      )
    );
  }

  cambiarEstado(id: string, estado: EstadoTurno): void {
    this._turnos.update((lista) => lista.map((turno) => (turno.id === id ? { ...turno, estado } : turno)));
  }

  eliminar(id: string): void {
    this._turnos.update((lista) => lista.filter((turno) => turno.id !== id));
  }

  obtenerPorId(id: string): Turno | undefined {
    return this._turnos().find((t) => t.id === id);
  }

  private calcularRango(fecha: Date, hora: string, duracionMinutos: number): { inicio: Date; fin: Date } {
    const [horas, minutos] = hora.split(':').map(Number);
    const inicio = new Date(fecha);
    inicio.setHours(horas, minutos, 0, 0);
    const fin = new Date(inicio.getTime() + duracionMinutos * 60 * 1000);
    return { inicio, fin };
  }

  private datosIniciales(): Turno[] {
    const horas = (offset: number) => new Date(Date.now() + offset * 60 * 60 * 1000);
    const enHora = (fecha: Date, hora: number, minuto = 0) => {
      const copia = new Date(fecha);
      copia.setHours(hora, minuto, 0, 0);
      return copia;
    };

    const pacientes = this.pacientesService.pacientesFiltrados();
    const porId = (id: string) => pacientes.find((p) => p.id === id);
    const nombre = (id: string, fallback: string) => {
      const p = porId(id);
      return p ? nombreCompleto(p) : fallback;
    };

    const hoy = new Date();
    const manana = horas(24);
    const pasadoManana = horas(48);

    return [
      { id: 't-1', pacienteId: 'p-1', pacienteNombre: nombre('p-1', 'Martina Gómez'), motivo: 'Control de ortodoncia', inicio: enHora(hoy, 9, 30), fin: enHora(hoy, 10, 0), profesional: 'Dra. Lucía Fernández', estado: 'confirmado' },
      { id: 't-2', pacienteId: 'p-2', pacienteNombre: nombre('p-2', 'Juan Carlos Pérez'), motivo: 'Endodoncia pieza 36', inicio: enHora(hoy, 11, 0), fin: enHora(hoy, 12, 0), profesional: 'Dr. Martín Suárez', estado: 'pendiente' },
      { id: 't-3', pacienteId: 'p-3', pacienteNombre: nombre('p-3', 'Sofía Ramírez'), motivo: 'Limpieza y control', inicio: enHora(hoy, 16, 0), fin: enHora(hoy, 16, 30), profesional: 'Dra. Lucía Fernández', estado: 'confirmado' },
      { id: 't-4', pacienteId: 'p-4', pacienteNombre: nombre('p-4', 'Ignacio Torres'), motivo: 'Colocación de implante', inicio: enHora(manana, 10, 0), fin: enHora(manana, 11, 30), profesional: 'Dr. Martín Suárez', estado: 'pendiente' },
      { id: 't-5', pacienteId: 'p-6', pacienteNombre: nombre('p-6', 'Valentina López'), motivo: 'Blanqueamiento dental', inicio: enHora(manana, 15, 0), fin: enHora(manana, 16, 0), profesional: 'Dra. Lucía Fernández', estado: 'ausente' },
      { id: 't-6', pacienteId: 'p-5', pacienteNombre: nombre('p-5', 'Camila Díaz'), motivo: 'Consulta de urgencia', inicio: enHora(pasadoManana, 9, 0), fin: enHora(pasadoManana, 9, 30), profesional: 'Dr. Martín Suárez', estado: 'cancelado' },
      { id: 't-7', pacienteId: 'p-8', pacienteNombre: nombre('p-8', 'Lucía Sánchez'), motivo: 'Control preventivo', inicio: enHora(horas(-24), 14, 0), fin: enHora(horas(-24), 14, 30), profesional: 'Dra. Lucía Fernández', estado: 'atendido' },
    ];
  }
}