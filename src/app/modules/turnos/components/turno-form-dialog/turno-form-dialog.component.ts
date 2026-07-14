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
import { Turno, TurnoFormValue, DURACIONES_TURNO } from '../../models/turno.model';
import { TurnosService } from '../../services/turnos.service';
import { ESTADO_TURNO_CONFIG, EstadoTurno } from '../../../../shared/interfaces/estado-turno.interface';

export interface TurnoFormDialogData {
  /** Si viene un turno, el diálogo abre en modo edición. */
  turno: Turno | null;
  /** Fecha sugerida al crear un turno nuevo (ej: la fecha en la que se hizo clic en el calendario). */
  fechaSugerida?: Date;
}

@Component({
  selector: 'app-turno-form-dialog',
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
  templateUrl: './turno-form-dialog.component.html',
})
export class TurnoFormDialogComponent {
  private readonly fb = new FormBuilder();
  private readonly turnosService = inject(TurnosService);

  readonly dialogRef = inject(MatDialogRef<TurnoFormDialogComponent, TurnoFormValue | undefined>);
  readonly data = inject<TurnoFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.turno;
  readonly pacientes = this.turnosService.pacientesDisponibles;
  readonly profesionales = this.turnosService.profesionales;
  readonly duraciones = DURACIONES_TURNO;
  readonly estadosDisponibles = Object.entries(ESTADO_TURNO_CONFIG) as [EstadoTurno, { label: string }][];

  readonly form = this.fb.group({
    pacienteId: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    fecha: this.fb.control<Date | null>(null, Validators.required),
    hora: ['', Validators.required],
    duracionMinutos: this.fb.control<number>(30, { nonNullable: true, validators: Validators.required }),
    profesional: ['', Validators.required],
    estado: this.fb.control<EstadoTurno>('pendiente', { nonNullable: true }),
    notas: [''],
  });

  constructor() {
    const turno = this.data.turno;
    if (turno) {
      this.form.patchValue({
        pacienteId: turno.pacienteId,
        motivo: turno.motivo,
        fecha: turno.inicio,
        hora: this.formatearHora(turno.inicio),
        duracionMinutos: Math.round((turno.fin.getTime() - turno.inicio.getTime()) / 60000),
        profesional: turno.profesional,
        estado: turno.estado,
        notas: turno.notas ?? '',
      });
    } else if (this.data.fechaSugerida) {
      this.form.patchValue({ fecha: this.data.fechaSugerida });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const resultado: TurnoFormValue = {
      pacienteId: valores.pacienteId!,
      motivo: valores.motivo!.trim(),
      fecha: valores.fecha!,
      hora: valores.hora!,
      duracionMinutos: valores.duracionMinutos,
      profesional: valores.profesional!,
      estado: valores.estado,
      notas: valores.notas?.trim() || undefined,
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }

  private formatearHora(fecha: Date): string {
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}