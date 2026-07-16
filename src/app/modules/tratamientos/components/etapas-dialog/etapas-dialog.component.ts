import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TratamientosService } from '../../services/tratamientos.service';
import { calcularProgreso } from '../../models/tratamiento.model';

export interface EtapasDialogData {
  tratamientoId: string;
}

/**
 * Diálogo de seguimiento de etapas de un tratamiento.
 *
 * A diferencia de los demás diálogos del proyecto, este no devuelve un
 * resultado al cerrarse (`dialogRef.close()` sin argumento): cada acción
 * (tildar, agregar, eliminar una etapa) se aplica de inmediato contra
 * `TratamientosService`, así que no hace falta "guardar" nada al final.
 * El diálogo lee el tratamiento con un `computed()` sobre el servicio,
 * por lo que la barra de progreso se actualiza sola con cada cambio.
 */
@Component({
  selector: 'app-etapas-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './etapas-dialog.component.html',
})
export class EtapasDialogComponent {
  private readonly tratamientosService = inject(TratamientosService);

  readonly dialogRef = inject(MatDialogRef<EtapasDialogComponent, void>);
  readonly data = inject<EtapasDialogData>(MAT_DIALOG_DATA);

  readonly nuevaEtapaControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  readonly tratamiento = computed(() => this.tratamientosService.obtenerPorId(this.data.tratamientoId));
  readonly progreso = computed(() => {
    const t = this.tratamiento();
    return t ? calcularProgreso(t) : 0;
  });

  toggleEtapa(etapaId: string): void {
    this.tratamientosService.toggleEtapa(this.data.tratamientoId, etapaId);
  }

  eliminarEtapa(etapaId: string): void {
    this.tratamientosService.eliminarEtapa(this.data.tratamientoId, etapaId);
  }

  agregarEtapa(): void {
    if (this.nuevaEtapaControl.invalid) {
      this.nuevaEtapaControl.markAsTouched();
      return;
    }
    this.tratamientosService.agregarEtapa(this.data.tratamientoId, this.nuevaEtapaControl.value.trim());
    this.nuevaEtapaControl.reset('');
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}