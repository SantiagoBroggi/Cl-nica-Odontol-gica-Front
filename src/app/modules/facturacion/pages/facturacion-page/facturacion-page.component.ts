import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FacturacionService } from '../../services/facturacion.service';
import { ResumenCuentaPaciente } from '../../models/pago.model';
import {
  CuentaCorrienteDialogComponent,
  CuentaCorrienteDialogData,
} from '../../components/cuenta-corriente-dialog/cuenta-corriente-dialog.component';

@Component({
  selector: 'app-facturacion-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './facturacion-page.component.html',
})
export class FacturacionPageComponent {
  private readonly facturacionService = inject(FacturacionService);
  private readonly dialog = inject(MatDialog);

  private readonly busqueda = signal('');

  readonly totales = this.facturacionService.totalesGenerales;

  readonly cuentas = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    const resumen = this.facturacionService.resumenPorPaciente();
    if (!termino) return resumen;
    return resumen.filter((r) => r.pacienteNombre.toLowerCase().includes(termino));
  });

  onBuscar(termino: string): void {
    this.busqueda.set(termino);
  }

  abrirCuentaCorriente(cuenta: ResumenCuentaPaciente): void {
    this.dialog.open<CuentaCorrienteDialogComponent, CuentaCorrienteDialogData>(CuentaCorrienteDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: { pacienteId: cuenta.pacienteId, pacienteNombre: cuenta.pacienteNombre },
    });
  }
}