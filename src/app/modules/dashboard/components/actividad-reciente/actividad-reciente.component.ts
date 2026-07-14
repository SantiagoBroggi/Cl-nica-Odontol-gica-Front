import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadReciente } from '../../models/actividad-reciente.model';
import { TiempoRelativoPipe } from '../../../../shared/pipes/tiempo-relativo.pipe';

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  imports: [CommonModule, TiempoRelativoPipe],
  templateUrl: './actividad-reciente.component.html',
  styleUrl: './actividad-reciente.component.scss',
})
export class ActividadRecienteComponent {
  @Input({ required: true }) actividades: ActividadReciente[] = [];
}