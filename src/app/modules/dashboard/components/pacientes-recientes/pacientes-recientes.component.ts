import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PacienteReciente } from '../../models/paciente-reciente.model';
import { TiempoRelativoPipe } from '../../../../shared/pipes/tiempo-relativo.pipe';

@Component({
  selector: 'app-pacientes-recientes',
  standalone: true,
  imports: [CommonModule, RouterLink, TiempoRelativoPipe],
  templateUrl: './pacientes-recientes.component.html',
  styleUrl: './pacientes-recientes.component.scss',
})
export class PacientesRecientesComponent {
  @Input({ required: true }) pacientes: PacienteReciente[] = [];
}