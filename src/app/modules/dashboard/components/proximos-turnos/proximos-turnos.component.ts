import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TurnoProximo } from '../../models/turno-proximo.model';
import { TiempoRelativoPipe } from '../../../../shared/pipes/tiempo-relativo.pipe';
import { EstadoTurnoBadgeComponent } from '../../../../shared/components/estado-turno-badge/estado-turno-badge.component';

@Component({
  selector: 'app-proximos-turnos',
  standalone: true,
  imports: [CommonModule, RouterLink, TiempoRelativoPipe, EstadoTurnoBadgeComponent],
  templateUrl: './proximos-turnos.component.html',
  styleUrl: './proximos-turnos.component.scss',
})
export class ProximosTurnosComponent {
  @Input({ required: true }) turnos: TurnoProximo[] = [];
}