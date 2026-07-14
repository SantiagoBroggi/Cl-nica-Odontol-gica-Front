import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCard } from '../../models/kpi-card.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  @Input({ required: true }) kpi!: KpiCard;

  get esPositiva(): boolean {
    return this.kpi.variacion >= 0;
  }

  // Clases completas y literales (no `bg-${color}-100`) para que Tailwind
  // las detecte en el escaneo JIT.
  get claseIcono(): string {
    switch (this.kpi.colorClase) {
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'rose': return 'bg-rose-50 text-rose-600';
      case 'brand':
      default: return 'bg-brand-50 text-brand-600';
    }
  }
}