import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Paciente, PacienteFormValue } from '../../models/paciente.model';
import { FormValidators } from '../../../../shared/utils/form-validators';

export interface PacienteFormDialogData {
  /** Si viene un paciente, el diálogo abre en modo edición; si no, en modo alta. */
  paciente: Paciente | null;
}

/**
 * Diálogo de alta/edición de paciente con Reactive Forms.
 *
 * Un solo componente cubre "crear" y "editar": si `data.paciente` viene
 * definido, se precarga el formulario con `patchValue` y el título/botón
 * cambian de texto. Evita mantener dos formularios casi idénticos.
 */
@Component({
  selector: 'app-paciente-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './paciente-form-dialog.component.html',
})
export class PacienteFormDialogComponent {
  private readonly fb = new FormBuilder();

  readonly dialogRef = inject(MatDialogRef<PacienteFormDialogComponent, PacienteFormValue | undefined>);
  readonly data = inject<PacienteFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.paciente;
  readonly fechaMaxima = new Date();

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    dni: ['', [Validators.required, FormValidators.dni()]],
    telefono: ['', [Validators.required, FormValidators.telefono()]],
    email: ['', [Validators.email]],
    fechaNacimiento: this.fb.control<Date | null>(null, [Validators.required, FormValidators.fechaNoFutura()]),
    obraSocial: [''],
    direccion: [''],
    notas: [''],
  });

  constructor() {
    if (this.data.paciente) {
      this.form.patchValue({
        nombre: this.data.paciente.nombre,
        apellido: this.data.paciente.apellido,
        dni: this.data.paciente.dni,
        telefono: this.data.paciente.telefono,
        email: this.data.paciente.email ?? '',
        fechaNacimiento: this.data.paciente.fechaNacimiento,
        obraSocial: this.data.paciente.obraSocial ?? '',
        direccion: this.data.paciente.direccion ?? '',
        notas: this.data.paciente.notas ?? '',
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const resultado: PacienteFormValue = {
      nombre: valores.nombre!.trim(),
      apellido: valores.apellido!.trim(),
      dni: valores.dni!.trim(),
      telefono: valores.telefono!.trim(),
      email: valores.email?.trim() || undefined,
      fechaNacimiento: valores.fechaNacimiento!,
      obraSocial: valores.obraSocial?.trim() || undefined,
      direccion: valores.direccion?.trim() || undefined,
      notas: valores.notas?.trim() || undefined,
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }
}
