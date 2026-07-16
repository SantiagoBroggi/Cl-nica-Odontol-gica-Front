/**
 * Estado general de un tratamiento.
 */
export type EstadoTratamiento = 'planificado' | 'en-curso' | 'finalizado' | 'cancelado';

export interface EstadoTratamientoConfig {
  label: string;
  claseTexto: string;
  claseFondo: string;
}

export const ESTADO_TRATAMIENTO_CONFIG: Record<EstadoTratamiento, EstadoTratamientoConfig> = {
  planificado: { label: 'Planificado', claseTexto: 'text-amber-700', claseFondo: 'bg-amber-100' },
  'en-curso': { label: 'En curso', claseTexto: 'text-brand-700', claseFondo: 'bg-brand-100' },
  finalizado: { label: 'Finalizado', claseTexto: 'text-emerald-700', claseFondo: 'bg-emerald-100' },
  cancelado: { label: 'Cancelado', claseTexto: 'text-rose-700', claseFondo: 'bg-rose-100' },
};

/**
 * Una etapa dentro del seguimiento de un tratamiento (ej: "Sesión 1 de
 * endodoncia", "Colocación de brackets"). El tratamiento no tiene una
 * cantidad fija de etapas: se van agregando a medida que avanza.
 */
export interface EtapaTratamiento {
  id: string;
  nombre: string;
  completada: boolean;
  fecha?: Date;
}

/**
 * Modelo de dominio de un tratamiento.
 *
 * Igual que `Turno` (Etapa 4), desnormaliza `pacienteNombre` a propósito
 * (simula la respuesta de un `GET /tratamientos` con join ya resuelto).
 * El costo vive acá como una referencia (`costoTotal`) — el seguimiento
 * de pagos y deuda real es responsabilidad del módulo de Facturación
 * (Etapa 8), que va a reutilizar este `costoTotal` como base.
 */
export interface Tratamiento {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  nombre: string;
  descripcion?: string;
  profesional: string;
  estado: EstadoTratamiento;
  costoTotal: number;
  fechaInicio: Date;
  etapas: EtapaTratamiento[];
  creadoEl: Date;
}

/** Forma de los datos que vienen del formulario reactivo de alta/edición. */
export type TratamientoFormValue = Pick<Tratamiento, 'pacienteId' | 'nombre' | 'descripcion' | 'profesional' | 'estado' | 'costoTotal' | 'fechaInicio'>;

/** Porcentaje de etapas completadas (0-100). Un tratamiento sin etapas se considera en 0%. */
export function calcularProgreso(tratamiento: Tratamiento): number {
  if (tratamiento.etapas.length === 0) return 0;
  const completadas = tratamiento.etapas.filter((e) => e.completada).length;
  return Math.round((completadas / tratamiento.etapas.length) * 100);
}