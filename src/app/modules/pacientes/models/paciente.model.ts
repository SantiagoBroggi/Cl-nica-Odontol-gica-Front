/**
 * Modelo de dominio de un paciente del consultorio.
 *
 * Es el modelo "completo" del módulo (a diferencia de `PacienteReciente`
 * en `modules/dashboard`, que es una proyección liviana). Cuando
 * conectemos FastAPI, esta interfaz debería reflejar 1 a 1 el schema de
 * Pydantic que devuelva `GET /pacientes`.
 */
export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string;
  fechaNacimiento: Date;
  obraSocial?: string;
  direccion?: string;
  notas?: string;
  ultimaConsulta: Date | null;
  proximoTurno: Date | null;
  creadoEl: Date;
}

/** Forma de los datos que vienen del formulario reactivo (alta/edición). */
export type PacienteFormValue = Pick<
  Paciente,
  'nombre' | 'apellido' | 'dni' | 'telefono' | 'email' | 'fechaNacimiento' | 'obraSocial' | 'direccion' | 'notas'
>;

/** Nombre completo, usado en tabla, avatares y diálogos de confirmación. */
export function nombreCompleto(paciente: Paciente): string {
  return `${paciente.nombre} ${paciente.apellido}`;
}

/** Iniciales para el avatar circular (ej: "Martina Gómez" -> "MG"). */
export function iniciales(paciente: Paciente): string {
  const inicialNombre = paciente.nombre.trim().charAt(0) ?? '';
  const inicialApellido = paciente.apellido.trim().charAt(0) ?? '';
  return `${inicialNombre}${inicialApellido}`.toUpperCase();
}

/** Edad en años a partir de la fecha de nacimiento, calculada al vuelo. */
export function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const noCumplioAunEsteAnio =
    hoy.getMonth() < fechaNacimiento.getMonth() ||
    (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate());
  if (noCumplioAunEsteAnio) {
    edad--;
  }
  return edad;
}
