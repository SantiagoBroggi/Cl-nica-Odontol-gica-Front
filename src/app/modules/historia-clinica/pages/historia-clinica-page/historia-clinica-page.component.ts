import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PacientesService } from '../../../pacientes/services/pacientes.service';
import { calcularEdad, iniciales, nombreCompleto } from '../../../pacientes/models/paciente.model';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { AvatarInicialesComponent } from '../../../../shared/components/avatar-iniciales/avatar-iniciales.component';
import {
  AntecedentesFormDialogComponent,
  AntecedentesFormDialogData,
} from '../../components/antecedentes-form-dialog/antecedentes-form-dialog.component';
import {
  ConsultaFormDialogComponent,
  ConsultaFormDialogData,
} from '../../components/consulta-form-dialog/consulta-form-dialog.component';

/**
 * Perfil clínico completo de un paciente puntual.
 *
 * Toma el `id` de la URL (`/historia-clinica/:id`) y compone tres cosas
 * a partir de servicios ya existentes: los datos personales (de
 * `PacientesService`, Etapa 3) y los antecedentes + evolución clínica
 * (de `HistoriaClinicaService`, esta etapa).
 */
@Component({
  selector: 'app-historia-clinica-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, AvatarInicialesComponent],
  templateUrl: './historia-clinica-page.component.html',
})
export class HistoriaClinicaPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pacientesService = inject(PacientesService);
  private readonly historiaClinicaService = inject(HistoriaClinicaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private readonly pacienteId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly paciente = computed(() => this.pacientesService.obtenerPorId(this.pacienteId));
  readonly nombreCompleto = nombreCompleto;
  readonly iniciales = iniciales;
  readonly calcularEdad = calcularEdad;

  readonly antecedentes = computed(() => this.historiaClinicaService.obtenerAntecedentes(this.pacienteId));

  readonly consultas = computed(() =>
    this.historiaClinicaService
      .consultas()
      .filter((c) => c.pacienteId === this.pacienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
  );

  constructor() {
    // Si el ID de la URL no corresponde a ningún paciente (link roto,
    // paciente eliminado, etc.), se vuelve al selector en vez de mostrar
    // una página vacía o rota.
    if (!this.paciente()) {
      this.router.navigate(['/historia-clinica']);
    }
  }

  abrirEditarAntecedentes(): void {
    const paciente = this.paciente();
    if (!paciente) return;

    const ref = this.dialog.open<AntecedentesFormDialogComponent, AntecedentesFormDialogData>(
      AntecedentesFormDialogComponent,
      {
        width: '640px',
        maxWidth: '95vw',
        data: { pacienteNombre: nombreCompleto(paciente), antecedentes: this.antecedentes() },
      }
    );

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.historiaClinicaService.guardarAntecedentes(this.pacienteId, valores);
      this.snackBar.open('Antecedentes médicos actualizados.', 'Cerrar', { duration: 3000 });
    });
  }

  abrirNuevaConsulta(): void {
    const paciente = this.paciente();
    if (!paciente) return;

    const ref = this.dialog.open<ConsultaFormDialogComponent, ConsultaFormDialogData>(ConsultaFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      data: { pacienteNombre: nombreCompleto(paciente) },
    });

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.historiaClinicaService.crearConsulta(this.pacienteId, valores);
      this.snackBar.open('Consulta registrada en la evolución clínica.', 'Cerrar', { duration: 3000 });
    });
  }
}