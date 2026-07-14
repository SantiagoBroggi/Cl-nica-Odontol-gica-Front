import { ChartData, ChartType } from 'chart.js';

/**
 * Configuración mínima que necesita `ChartCardComponent` (shared) para
 * renderizar un gráfico de Chart.js dentro de una tarjeta consistente.
 *
 * Vive en `shared/interfaces` (no en `modules/dashboard`) porque el
 * módulo de Reportes (Etapa 9) va a reutilizar el mismo componente y la
 * misma forma de configuración para sus propios gráficos.
 */
export interface ChartCardConfig {
  tipo: ChartType;
  titulo: string;
  subtitulo?: string;
  data: ChartData;
}