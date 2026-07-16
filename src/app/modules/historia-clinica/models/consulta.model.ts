/**
 * Registro de una consulta dentro de la evolución clínica de un
 * paciente. Cada paciente tiene una lista de estas, ordenada por fecha
 * descendente en la UI.
 */
export interface Consulta {
  id: string;
  pacienteId: string;
  fecha: Date;
  motivo: string;
  diagnostico: string;
  tratamientoRealizado: string;
  profesional: string;
  notas?: string;
}

/** Forma de los datos que vienen del formulario reactivo (alta de consulta). */
export type ConsultaFormValue = Omit<Consulta, 'id' | 'pacienteId'>;