import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  /** Si es true, el botón de confirmar se pinta en rojo (acciones destructivas). */
  peligroso?: boolean;
}

/**
 * Diálogo de confirmación genérico basado en Angular Material.
 *
 * Vive en `shared/components` porque lo va a usar cualquier módulo que
 * necesite un "¿estás seguro?" antes de una acción destructiva: eliminar
 * un paciente (Etapa 3), cancelar un turno (Etapa 4), anular un pago
 * (Etapa 8), etc. Evita reimplementar el mismo diálogo en cada módulo.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="!text-base !font-semibold !text-slate-800">{{ data.titulo }}</h2>
    <mat-dialog-content class="!text-sm !text-slate-600">
      {{ data.mensaje }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">
        {{ data.textoCancelar ?? 'Cancelar' }}
      </button>
      <button
        mat-flat-button
        [color]="data.peligroso ? 'warn' : 'primary'"
        (click)="dialogRef.close(true)"
      >
        {{ data.textoConfirmar ?? 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
