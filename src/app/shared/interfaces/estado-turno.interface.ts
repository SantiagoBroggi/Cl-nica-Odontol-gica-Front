/**
 * Estado de un turno. Vive en `shared/interfaces` (no en
 * `modules/turnos`) porque el Dashboard (Etapa 2) ya necesita mostrar
 * turnos con estado antes de que el módulo de Agenda (Etapa 4) exista
 * formalmente. Cuando se construya `modules/turnos`, va a reutilizar
 * este mismo tipo en vez de duplicarlo.
 */
export type EstadoTurno = 'pendiente' | 'confirmado' | 'atendido' | 'cancelado' | 'ausente';

export interface EstadoTurnoConfig {
  label: string;
  claseTexto: string;
  claseFondo: string;
}

export const ESTADO_TURNO_CONFIG: Record<EstadoTurno, EstadoTurnoConfig> = {
  pendiente: { label: 'Pendiente', claseTexto: 'text-amber-700', claseFondo: 'bg-amber-100' },
  confirmado: { label: 'Confirmado', claseTexto: 'text-brand-700', claseFondo: 'bg-brand-100' },
  atendido: { label: 'Atendido', claseTexto: 'text-emerald-700', claseFondo: 'bg-emerald-100' },
  cancelado: { label: 'Cancelado', claseTexto: 'text-rose-700', claseFondo: 'bg-rose-100' },
  ausente: { label: 'Ausente', claseTexto: 'text-slate-600', claseFondo: 'bg-slate-200' },
};