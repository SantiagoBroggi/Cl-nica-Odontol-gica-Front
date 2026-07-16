import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESTADO_DIENTE_CONFIG, EstadoDiente } from '../../models/diente.model';

/**
 * Una pieza dental individual, clickeable.
 *
 * Se dibuja como una forma simplificada (no una ilustración anatómica
 * real) coloreada según el estado — es el approach estándar en la
 * mayoría de los softwares odontológicos: prioriza que se entienda de
 * un vistazo el estado de cada pieza por sobre el realismo del dibujo.
 */
@Component({
  selector: 'app-diente-svg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diente-svg.component.html',
})
export class DienteSvgComponent {
  @Input({ required: true }) numero!: number;
  @Input({ required: true }) estado!: EstadoDiente;
  @Output() seleccionar = new EventEmitter<void>();

  get config() {
    return ESTADO_DIENTE_CONFIG[this.estado];
  }
}