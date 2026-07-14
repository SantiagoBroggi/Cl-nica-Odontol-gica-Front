import { EstadoTurno } from '../../../shared/interfaces/estado-turno.interface';

/**
 * Modelo de dominio de un turno.
 *
 * `pacienteId` referencia a un `Paciente` real de `modules/pacientes`
 * (a diferencia del `TurnoProximo` liviano del dashboard, acá sí importa
 * tener la relación real porque este módulo es el dueño del turno).
 * `pacienteNombre` queda desnormalizado en el modelo a propósito: así se
 * comportaría la respuesta de `GET /turnos` en FastAPI si el backend
 * devuelve el turno con el nombre del paciente ya resuelto (join), que es
 * lo más cómodo para pintar el calendario sin pedidos extra.
 */
export interface Turno {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  motivo: string;
  inicio: Date;
  fin: Date;
  profesional: string;
  estado: EstadoTurno;
  notas?: string;
}

/** Forma de los datos que vienen del formulario reactivo (alta/edición). */
export interface TurnoFormValue {
  pacienteId: string;
  motivo: string;
  fecha: Date;
  hora: string; // formato 'HH:mm'
  duracionMinutos: number;
  profesional: string;
  estado: EstadoTurno;
  notas?: string;
}

/** Profesionales del consultorio disponibles para asignar turnos. */
export const PROFESIONALES: string[] = ['Dra. Lucía Fernández', 'Dr. Martín Suárez'];

/** Duraciones típicas de un turno, en minutos. */
export const DURACIONES_TURNO = [15, 30, 45, 60, 90] as const;