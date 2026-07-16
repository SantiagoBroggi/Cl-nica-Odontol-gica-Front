import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ConsultaFormValue } from '../../models/consulta.model';
import { PROFESIONALES } from '../../../turnos/models/turno.model';

export interface ConsultaFormDialogData {
  pacienteNombre: string;
}

/**
 * Diálogo de alta de una nueva consulta en la evolución clínica.
 *
 * A diferencia de Pacientes/Turnos, acá no hay edición: una consulta ya
 * registrada es parte del historial y no se modifica retroactivamente
 * (igual que en una historia clínica real). Solo se puede agregar una
 * nueva entrada.
 *
 * Reutiliza la lista de `PROFESIONALES` del módulo de Turnos en vez de
 * duplicarla: son las mismas dos personas del consultorio.
 */
@Component({
  selector: 'app-consulta-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './consulta-form-dialog.component.html',
})
export class ConsultaFormDialogComponent {
  private readonly fb = new FormBuilder();

  readonly dialogRef = inject(MatDialogRef<ConsultaFormDialogComponent, ConsultaFormValue | undefined>);
  readonly data = inject<ConsultaFormDialogData>(MAT_DIALOG_DATA);

  readonly profesionales = PROFESIONALES;
  readonly fechaMaxima = new Date();

  readonly form = this.fb.group({
    fecha: this.fb.control<Date | null>(new Date(), Validators.required),
    motivo: ['', [Validators.required, Validators.minLength(3)]],
    diagnostico: ['', Validators.required],
    tratamientoRealizado: ['', Validators.required],
    profesional: ['', Validators.required],
    notas: [''],
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const resultado: ConsultaFormValue = {
      fecha: valores.fecha!,
      motivo: valores.motivo!.trim(),
      diagnostico: valores.diagnostico!.trim(),
      tratamientoRealizado: valores.tratamientoRealizado!.trim(),
      profesional: valores.profesional!,
      notas: valores.notas?.trim() || undefined,
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }
}