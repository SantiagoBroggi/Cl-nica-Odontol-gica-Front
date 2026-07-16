import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PacientesService } from '../../../pacientes/services/pacientes.service';
import { nombreCompleto, iniciales } from '../../../pacientes/models/paciente.model';
import { AvatarInicialesComponent } from '../../../../shared/components/avatar-iniciales/avatar-iniciales.component';

/**
 * Página de entrada a Historia Clínica cuando todavía no se eligió un
 * paciente (ej: al hacer clic en "Historia Clínica" desde el sidebar).
 *
 * Reutiliza `PacientesService` (Etapa 3) para buscar y listar; al
 * elegir un paciente, navega a `/historia-clinica/:id`, que es donde
 * vive el perfil clínico real.
 */
@Component({
  selector: 'app-historia-clinica-selector-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, AvatarInicialesComponent],
  templateUrl: './historia-clinica-selector-page.component.html',
})
export class HistoriaClinicaSelectorPageComponent {
  private readonly pacientesService = inject(PacientesService);
  private readonly router = inject(Router);

  readonly pacientes = this.pacientesService.pacientesFiltrados;

  readonly nombreCompleto = nombreCompleto;
  readonly iniciales = iniciales;

  onBuscar(termino: string): void {
    this.pacientesService.setBusqueda(termino);
  }

  irAHistoria(pacienteId: string): void {
    this.router.navigate(['/historia-clinica', pacienteId]);
  }
}