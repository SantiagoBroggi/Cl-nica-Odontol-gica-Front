import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AntecedentesMedicos, AntecedentesFormValue } from '../../models/antecedentes.model';

export interface AntecedentesFormDialogData {
  pacienteNombre: string;
  antecedentes: AntecedentesMedicos | undefined;
}

@Component({
  selector: 'app-antecedentes-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './antecedentes-form-dialog.component.html',
})
export class AntecedentesFormDialogComponent {
  private readonly fb = new FormBuilder();

  readonly dialogRef = inject(MatDialogRef<AntecedentesFormDialogComponent, AntecedentesFormValue | undefined>);
  readonly data = inject<AntecedentesFormDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    alergias: ['', Validators.required],
    medicacionActual: ['', Validators.required],
    enfermedadesPreexistentes: ['', Validators.required],
    cirugiasPrevias: [''],
    habitos: [''],
    observaciones: [''],
  });

  constructor() {
    const a = this.data.antecedentes;
    if (a) {
      this.form.patchValue({
        alergias: a.alergias,
        medicacionActual: a.medicacionActual,
        enfermedadesPreexistentes: a.enfermedadesPreexistentes,
        cirugiasPrevias: a.cirugiasPrevias,
        habitos: a.habitos,
        observaciones: a.observaciones,
      });
    } else {
      this.form.patchValue({ alergias: 'Ninguna conocida', medicacionActual: 'Ninguna' });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.dialogRef.close({
      alergias: valores.alergias!.trim(),
      medicacionActual: valores.medicacionActual!.trim(),
      enfermedadesPreexistentes: valores.enfermedadesPreexistentes!.trim(),
      cirugiasPrevias: valores.cirugiasPrevias?.trim() ?? '',
      habitos: valores.habitos?.trim() ?? '',
      observaciones: valores.observaciones?.trim() ?? '',
    });
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }
}