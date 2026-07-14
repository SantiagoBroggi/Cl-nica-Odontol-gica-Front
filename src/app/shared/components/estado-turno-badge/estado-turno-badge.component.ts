import { Component, Input } from '@angular/core';
import { ESTADO_TURNO_CONFIG, EstadoTurno } from '../../interfaces/estado-turno.interface';

@Component({
  selector: 'app-estado-turno-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      [class]="config.claseTexto + ' ' + config.claseFondo"
    >
      {{ config.label }}
    </span>
  `,
})
export class EstadoTurnoBadgeComponent {
  @Input({ required: true }) estado!: EstadoTurno;

  get config() {
    return ESTADO_TURNO_CONFIG[this.estado];
  }
}