import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FacturacionService } from '../../services/facturacion.service';
import { MEDIO_PAGO_LABELS, MedioPago, PagoFormValue } from '../../models/pago.model';

export interface CuentaCorrienteDialogData {
  pacienteId: string;
  pacienteNombre: string;
}

/**
 * Diálogo de cuenta corriente de un paciente: resumen de saldo,
 * historial de pagos y alta de un pago nuevo, todo en un solo lugar.
 *
 * Igual que `EtapasDialogComponent` (Etapa 7), no devuelve resultado al
 * cerrar: cada pago se registra de inmediato contra `FacturacionService`
 * y el resumen se recalcula solo porque está armado con `computed()`.
 */
@Component({
  selector: 'app-cuenta-corriente-dialog',
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
  templateUrl: './cuenta-corriente-dialog.component.html',
})
export class CuentaCorrienteDialogComponent {
  private readonly fb = new FormBuilder();
  private readonly facturacionService = inject(FacturacionService);

  readonly dialogRef = inject(MatDialogRef<CuentaCorrienteDialogComponent, void>);
  readonly data = inject<CuentaCorrienteDialogData>(MAT_DIALOG_DATA);

  readonly mediosPago = Object.entries(MEDIO_PAGO_LABELS) as [MedioPago, string][];
  readonly tratamientos = this.facturacionService.tratamientosDe(this.data.pacienteId);
  readonly pagos = this.facturacionService.pagosDe(this.data.pacienteId);

  readonly resumen = computed(() =>
    this.facturacionService.resumenPorPaciente().find((r) => r.pacienteId === this.data.pacienteId)
  );

  readonly form = this.fb.group({
    tratamientoId: [''],
    monto: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    medioPago: this.fb.control<MedioPago>('efectivo', { nonNullable: true }),
    fecha: this.fb.control<Date | null>(new Date(), Validators.required),
    notas: [''],
  });

  registrarPago(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const resultado: PagoFormValue = {
      tratamientoId: valores.tratamientoId || undefined,
      monto: valores.monto!,
      medioPago: valores.medioPago,
      fecha: valores.fecha!,
      notas: valores.notas?.trim() || undefined,
    };

    this.facturacionService.registrarPago(this.data.pacienteId, resultado);
    this.form.reset({ tratamientoId: '', monto: null, medioPago: 'efectivo', fecha: new Date(), notas: '' });
  }

  eliminarPago(id: string): void {
    this.facturacionService.eliminarPago(id);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}