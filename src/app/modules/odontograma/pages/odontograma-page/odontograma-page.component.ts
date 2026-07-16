import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PacientesService } from '../../../pacientes/services/pacientes.service';
import { iniciales, nombreCompleto } from '../../../pacientes/models/paciente.model';
import { OdontogramaService } from '../../services/odontograma.service';
import { ARCADA_SUPERIOR, ESTADO_DIENTE_CONFIG, EstadoDiente } from '../../models/diente.model';
import { AvatarInicialesComponent } from '../../../../shared/components/avatar-iniciales/avatar-iniciales.component';
import { DienteSvgComponent } from '../../components/diente-svg/diente-svg.component';
import {
  DienteFormDialogComponent,
  DienteFormDialogData,
} from '../../components/diente-form-dialog/diente-form-dialog.component';

/**
 * Odontograma completo de un paciente puntual (`/odontograma/:id`).
 *
 * Separa las 32 piezas que devuelve `OdontogramaService.odontogramaDe`
 * en arcada superior/inferior (las primeras 16 vs. las últimas 16, dado
 * el orden ya armado en `numerosDientes`) solo para el layout visual;
 * el servicio no sabe nada de cómo se dibuja.
 */
@Component({
  selector: 'app-odontograma-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarInicialesComponent, DienteSvgComponent],
  templateUrl: './odontograma-page.component.html',
})
export class OdontogramaPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pacientesService = inject(PacientesService);
  private readonly odontogramaService = inject(OdontogramaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private readonly pacienteId = this.route.snapshot.paramMap.get('id') ?? '';
  private readonly cantidadArcadaSuperior = ARCADA_SUPERIOR.length;

  readonly paciente = computed(() => this.pacientesService.obtenerPorId(this.pacienteId));
  readonly nombreCompleto = nombreCompleto;
  readonly iniciales = iniciales;

  readonly leyendaEstados = Object.entries(ESTADO_DIENTE_CONFIG) as [EstadoDiente, { label: string; colorHex: string }][];

  private readonly odontograma = this.odontogramaService.odontogramaDe(this.pacienteId);

  readonly arcadaSuperior = computed(() => this.odontograma().slice(0, this.cantidadArcadaSuperior));
  readonly arcadaInferior = computed(() => this.odontograma().slice(this.cantidadArcadaSuperior));

  constructor() {
    if (!this.paciente()) {
      this.router.navigate(['/odontograma']);
    }
  }

  seleccionarDiente(numero: number): void {
    const registro = this.odontograma().find((d) => d.numero === numero);
    if (!registro) return;

    const ref = this.dialog.open<DienteFormDialogComponent, DienteFormDialogData>(DienteFormDialogComponent, {
      width: '420px',
      maxWidth: '95vw',
      data: { numero, registro },
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;
      this.odontogramaService.actualizarDiente(this.pacienteId, numero, resultado.estado, resultado.notas);
      this.snackBar.open(`Pieza ${numero} actualizada.`, 'Cerrar', { duration: 2500 });
    });
  }
}