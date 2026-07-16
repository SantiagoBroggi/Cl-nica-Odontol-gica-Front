import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DienteEstado, ESTADO_DIENTE_CONFIG, EstadoDiente } from '../../models/diente.model';

export interface DienteFormDialogData {
  numero: number;
  registro: DienteEstado;
}

export interface DienteFormResultado {
  estado: EstadoDiente;
  notas?: string;
}

/**
 * Diálogo para cambiar el estado de una pieza dental puntual.
 *
 * Se abre desde `OdontogramaPageComponent` al hacer clic en un diente
 * del gráfico. Es intencionalmente simple (un select + una nota): no
 * hay validaciones complejas porque cualquier estado es válido para
 * cualquier pieza.
 */
@Component({
  selector: 'app-diente-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './diente-form-dialog.component.html',
})
export class DienteFormDialogComponent {
  private readonly fb = new FormBuilder();

  readonly dialogRef = inject(MatDialogRef<DienteFormDialogComponent, DienteFormResultado | undefined>);
  readonly data = inject<DienteFormDialogData>(MAT_DIALOG_DATA);

  readonly estadosDisponibles = Object.entries(ESTADO_DIENTE_CONFIG) as [EstadoDiente, { label: string }][];

  readonly form = this.fb.group({
    estado: this.fb.control<EstadoDiente>(this.data.registro.estado, { nonNullable: true }),
    notas: [this.data.registro.notas ?? ''],
  });

  guardar(): void {
    const valores = this.form.getRawValue();
    this.dialogRef.close({ estado: valores.estado, notas: valores.notas?.trim() || undefined });
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }
}