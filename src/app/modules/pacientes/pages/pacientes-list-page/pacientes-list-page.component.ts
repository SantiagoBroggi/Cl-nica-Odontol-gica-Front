import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';

import { PacientesService, FiltroTurno } from '../../services/pacientes.service';
import { Paciente, calcularEdad, iniciales, nombreCompleto } from '../../models/paciente.model';
import { AvatarInicialesComponent } from '../../../../shared/components/avatar-iniciales/avatar-iniciales.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  PacienteFormDialogComponent,
  PacienteFormDialogData,
} from '../../components/paciente-form-dialog/paciente-form-dialog.component';

@Component({
  selector: 'app-pacientes-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatMenuModule,
    AvatarInicialesComponent,
  ],
  templateUrl: './pacientes-list-page.component.html',
})
export class PacientesListPageComponent {
  private readonly pacientesService = inject(PacientesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly totalPacientes = this.pacientesService.totalPacientes;
  readonly pacientesFiltrados = this.pacientesService.pacientesFiltrados;

  private readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  /** Página actual ya recortada, para no depender de MatTableDataSource. */
  readonly pacientesPagina = computed(() => {
    const inicio = this.pageIndex() * this.pageSize();
    return this.pacientesFiltrados().slice(inicio, inicio + this.pageSize());
  });

  // Helpers expuestos al template.
  readonly nombreCompleto = nombreCompleto;
  readonly iniciales = iniciales;
  readonly calcularEdad = calcularEdad;

  onBuscar(termino: string): void {
    this.pacientesService.setBusqueda(termino);
    this.pageIndex.set(0);
  }

  onFiltroChange(filtro: FiltroTurno): void {
    this.pacientesService.setFiltroTurno(filtro);
    this.pageIndex.set(0);
  }

  onPageChange(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
  }

  abrirNuevoPaciente(): void {
    const ref = this.dialog.open<PacienteFormDialogComponent, PacienteFormDialogData>(
      PacienteFormDialogComponent,
      { width: '640px', maxWidth: '95vw', data: { paciente: null } }
    );

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.pacientesService.crear(valores);
      this.snackBar.open('Paciente creado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  abrirEditarPaciente(paciente: Paciente): void {
    const ref = this.dialog.open<PacienteFormDialogComponent, PacienteFormDialogData>(
      PacienteFormDialogComponent,
      { width: '640px', maxWidth: '95vw', data: { paciente } }
    );

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.pacientesService.actualizar(paciente.id, valores);
      this.snackBar.open('Paciente actualizado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  confirmarEliminar(paciente: Paciente): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar paciente',
      mensaje: `¿Confirmás que querés eliminar a ${nombreCompleto(paciente)}? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligroso: true,
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;
      this.pacientesService.eliminar(paciente.id);
      this.snackBar.open('Paciente eliminado.', 'Cerrar', { duration: 3000 });
    });
  }
}
