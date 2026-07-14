import { EstadoTurno } from '../../../shared/interfaces/estado-turno.interface';

export interface TurnoProximo {
  id: string;
  pacienteNombre: string;
  pacienteIniciales: string;
  motivo: string;
  fechaHora: Date;
  profesional: string;
  estado: EstadoTurno;
}