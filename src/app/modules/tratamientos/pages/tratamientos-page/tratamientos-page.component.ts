import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TratamientosService, FiltroEstadoTratamiento } from '../../services/tratamientos.service';
import { Tratamiento, calcularProgreso, ESTADO_TRATAMIENTO_CONFIG, EstadoTratamiento } from '../../models/tratamiento.model';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  TratamientoFormDialogComponent,
  TratamientoFormDialogData,
} from '../../components/tratamiento-form-dialog/tratamiento-form-dialog.component';
import { EtapasDialogComponent, EtapasDialogData } from '../../components/etapas-dialog/etapas-dialog.component';

@Component({
  selector: 'app-tratamientos-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './tratamientos-page.component.html',
})
export class TratamientosPageComponent {
  private readonly tratamientosService = inject(TratamientosService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly tratamientos = this.tratamientosService.tratamientosFiltrados;
  readonly estadosDisponibles = Object.entries(ESTADO_TRATAMIENTO_CONFIG) as [EstadoTratamiento, { label: string }][];

  readonly calcularProgreso = calcularProgreso;

  get estadoConfig() {
    return ESTADO_TRATAMIENTO_CONFIG;
  }

  onBuscar(termino: string): void {
    this.tratamientosService.setBusqueda(termino);
  }

  onFiltroChange(filtro: FiltroEstadoTratamiento): void {
    this.tratamientosService.setFiltroEstado(filtro);
  }

  abrirNuevoTratamiento(): void {
    const ref = this.dialog.open<TratamientoFormDialogComponent, TratamientoFormDialogData>(
      TratamientoFormDialogComponent,
      { width: '640px', maxWidth: '95vw', data: { tratamiento: null } }
    );

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.tratamientosService.crear(valores);
      this.snackBar.open('Tratamiento creado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  abrirEditarTratamiento(tratamiento: Tratamiento): void {
    const ref = this.dialog.open<TratamientoFormDialogComponent, TratamientoFormDialogData>(
      TratamientoFormDialogComponent,
      { width: '640px', maxWidth: '95vw', data: { tratamiento } }
    );

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.tratamientosService.actualizar(tratamiento.id, valores);
      this.snackBar.open('Tratamiento actualizado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  abrirEtapas(tratamiento: Tratamiento): void {
    this.dialog.open<EtapasDialogComponent, EtapasDialogData>(EtapasDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: { tratamientoId: tratamiento.id },
    });
  }

  confirmarEliminar(tratamiento: Tratamiento): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar tratamiento',
      mensaje: `¿Confirmás que querés eliminar "${tratamiento.nombre}" de ${tratamiento.pacienteNombre}? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligroso: true,
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;
      this.tratamientosService.eliminar(tratamiento.id);
      this.snackBar.open('Tratamiento eliminado.', 'Cerrar', { duration: 3000 });
    });
  }
}