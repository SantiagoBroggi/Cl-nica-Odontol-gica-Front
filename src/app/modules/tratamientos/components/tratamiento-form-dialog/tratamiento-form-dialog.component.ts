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
import { Tratamiento, TratamientoFormValue, ESTADO_TRATAMIENTO_CONFIG, EstadoTratamiento } from '../../models/tratamiento.model';
import { TratamientosService } from '../../services/tratamientos.service';

export interface TratamientoFormDialogData {
  tratamiento: Tratamiento | null;
}

/**
 * Diálogo de alta/edición de los datos generales de un tratamiento.
 *
 * Mismo patrón que `PacienteFormDialogComponent` / `TurnoFormDialogComponent`:
 * un solo componente para alta y edición, y el campo "Estado" solo se
 * muestra en edición (un tratamiento nuevo siempre nace "Planificado").
 * La gestión de etapas vive en un diálogo aparte (`EtapasDialogComponent`)
 * porque es un flujo distinto: se abre y cierra muchas veces a medida que
 * avanza el tratamiento, mientras que los datos generales casi no cambian.
 */
@Component({
  selector: 'app-tratamiento-form-dialog',
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
  templateUrl: './tratamiento-form-dialog.component.html',
})
export class TratamientoFormDialogComponent {
  private readonly fb = new FormBuilder();
  private readonly tratamientosService = inject(TratamientosService);

  readonly dialogRef = inject(MatDialogRef<TratamientoFormDialogComponent, TratamientoFormValue | undefined>);
  readonly data = inject<TratamientoFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.tratamiento;
  readonly pacientes = this.tratamientosService.pacientesDisponibles;
  readonly profesionales = this.tratamientosService.profesionales;
  readonly estadosDisponibles = Object.entries(ESTADO_TRATAMIENTO_CONFIG) as [EstadoTratamiento, { label: string }][];

  readonly form = this.fb.group({
    pacienteId: ['', Validators.required],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    descripcion: [''],
    profesional: ['', Validators.required],
    costoTotal: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    fechaInicio: this.fb.control<Date | null>(new Date(), Validators.required),
    estado: this.fb.control<EstadoTratamiento>('planificado', { nonNullable: true }),
  });

  constructor() {
    const t = this.data.tratamiento;
    if (t) {
      this.form.patchValue({
        pacienteId: t.pacienteId,
        nombre: t.nombre,
        descripcion: t.descripcion ?? '',
        profesional: t.profesional,
        costoTotal: t.costoTotal,
        fechaInicio: t.fechaInicio,
        estado: t.estado,
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const resultado: TratamientoFormValue = {
      pacienteId: valores.pacienteId!,
      nombre: valores.nombre!.trim(),
      descripcion: valores.descripcion?.trim() || undefined,
      profesional: valores.profesional!,
      costoTotal: valores.costoTotal!,
      fechaInicio: valores.fechaInicio!,
      estado: valores.estado,
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }
}