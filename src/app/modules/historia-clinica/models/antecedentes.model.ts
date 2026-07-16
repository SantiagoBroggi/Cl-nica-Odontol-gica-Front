/**
 * Antecedentes médicos de un paciente.
 *
 * Es un registro único por paciente (a diferencia de las consultas, que
 * son una lista histórica) que se edita "in place" desde un formulario
 * de edición, no se crea uno nuevo cada vez.
 */
export interface AntecedentesMedicos {
  pacienteId: string;
  alergias: string;
  medicacionActual: string;
  enfermedadesPreexistentes: string;
  cirugiasPrevias: string;
  habitos: string;
  observaciones: string;
  actualizadoEl: Date;
}

/** Forma de los datos que vienen del formulario reactivo de edición. */
export type AntecedentesFormValue = Omit<AntecedentesMedicos, 'pacienteId' | 'actualizadoEl'>;