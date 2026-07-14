export interface KpiCard {
  id: string;
  etiqueta: string;
  valor: string;
  icono: string;
  variacion: number;
  variacionLabel: string;
  colorClase: 'brand' | 'emerald' | 'amber' | 'rose';
}