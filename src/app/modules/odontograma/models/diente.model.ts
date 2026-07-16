/**
 * Estado clínico de una pieza dental en el odontograma.
 */
export type EstadoDiente = 'sano' | 'caries' | 'restauracion' | 'extraccion' | 'implante' | 'corona';

export interface EstadoDienteConfig {
  label: string;
  colorHex: string;
  claseTexto: string;
  claseFondo: string;
}

export const ESTADO_DIENTE_CONFIG: Record<EstadoDiente, EstadoDienteConfig> = {
  sano: { label: 'Sano', colorHex: '#ffffff', claseTexto: 'text-slate-600', claseFondo: 'bg-white' },
  caries: { label: 'Caries', colorHex: '#e11d48', claseTexto: 'text-rose-700', claseFondo: 'bg-rose-100' },
  restauracion: { label: 'Restauración', colorHex: '#2688b3', claseTexto: 'text-brand-700', claseFondo: 'bg-brand-100' },
  extraccion: { label: 'Extracción', colorHex: '#64748b', claseTexto: 'text-slate-600', claseFondo: 'bg-slate-200' },
  implante: { label: 'Implante', colorHex: '#7c3aed', claseTexto: 'text-violet-700', claseFondo: 'bg-violet-100' },
  corona: { label: 'Corona', colorHex: '#f59e0b', claseTexto: 'text-amber-700', claseFondo: 'bg-amber-100' },
};

/**
 * Registro del estado de una pieza dental puntual para un paciente.
 */
export interface DienteEstado {
  pacienteId: string;
  numero: number;
  estado: EstadoDiente;
  notas?: string;
  actualizadoEl: Date;
}

/**
 * Numeración FDI (ISO 3950), el estándar usado en Argentina y la mayor
 * parte de Latinoamérica: 2 dígitos, el primero indica el cuadrante
 * (1: superior derecho, 2: superior izquierdo, 3: inferior izquierdo,
 * 4: inferior derecho) y el segundo la pieza dentro del cuadrante
 * (1: incisivo central … 8: tercer molar).
 *
 * Se arma como dos arcadas (superior/inferior), cada una ya en el orden
 * en que se dibujan de izquierda a derecha en un odontograma estándar.
 */
export const ARCADA_SUPERIOR: number[] = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const ARCADA_INFERIOR: number[] = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];