import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PacientesService } from '../../../pacientes/services/pacientes.service';
import { nombreCompleto, iniciales } from '../../../pacientes/models/paciente.model';
import { AvatarInicialesComponent } from '../../../../shared/components/avatar-iniciales/avatar-iniciales.component';

/**
 * Página de entrada a Odontograma cuando todavía no se eligió un
 * paciente. Mismo patrón que `HistoriaClinicaSelectorPageComponent`
 * (Etapa 5): buscar en `PacientesService` y navegar a `/odontograma/:id`.
 */
@Component({
  selector: 'app-odontograma-selector-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, AvatarInicialesComponent],
  templateUrl: './odontograma-selector-page.component.html',
})
export class OdontogramaSelectorPageComponent {
  private readonly pacientesService = inject(PacientesService);
  private readonly router = inject(Router);

  readonly pacientes = this.pacientesService.pacientesFiltrados;

  readonly nombreCompleto = nombreCompleto;
  readonly iniciales = iniciales;

  onBuscar(termino: string): void {
    this.pacientesService.setBusqueda(termino);
  }

  irAOdontograma(pacienteId: string): void {
    this.router.navigate(['/odontograma', pacienteId]);
  }
}