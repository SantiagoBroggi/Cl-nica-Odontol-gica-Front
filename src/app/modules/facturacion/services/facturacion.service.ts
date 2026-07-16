import { Injectable, computed, inject, signal } from '@angular/core';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { nombreCompleto } from '../../pacientes/models/paciente.model';
import { TratamientosService } from '../../tratamientos/services/tratamientos.service';
import { Pago, PagoFormValue, ResumenCuentaPaciente } from '../models/pago.model';

/**
 * Fuente de datos de Facturación.
 *
 * No guarda "cuánto se le facturó" a cada paciente como un dato propio:
 * lo calcula a partir de `TratamientosService` (suma de `costoTotal` de
 * sus tratamientos) cada vez que se lee `resumenPorPaciente`. Solo
 * persiste los `Pago` en sí, que es lo único que este módulo agrega al
 * sistema.
 */
@Injectable({ providedIn: 'root' })
export class FacturacionService {
  private readonly pacientesService = inject(PacientesService);
  private readonly tratamientosService = inject(TratamientosService);

  private readonly _pagos = signal<Pago[]>(this.datosIniciales());
  readonly pagos = this._pagos.asReadonly();

  /** Cuenta corriente de cada paciente que tiene al menos un tratamiento facturado. */
  readonly resumenPorPaciente = computed<ResumenCuentaPaciente[]>(() => {
    const tratamientos = this.tratamientosService.tratamientos();
    const pagos = this._pagos();

    const pacienteIds = new Set(tratamientos.map((t) => t.pacienteId));

    return Array.from(pacienteIds).map((pacienteId) => {
      const paciente = this.pacientesService.obtenerPorId(pacienteId);
      const totalFacturado = tratamientos
        .filter((t) => t.pacienteId === pacienteId && t.estado !== 'cancelado')
        .reduce((acum, t) => acum + t.costoTotal, 0);
      const totalPagado = pagos.filter((p) => p.pacienteId === pacienteId).reduce((acum, p) => acum + p.monto, 0);

      return {
        pacienteId,
        pacienteNombre: paciente ? nombreCompleto(paciente) : 'Paciente',
        totalFacturado,
        totalPagado,
        saldo: totalFacturado - totalPagado,
      };
    });
  });

  /** Totales generales del consultorio, para las tarjetas KPI de la página. */
  readonly totalesGenerales = computed(() => {
    const resumen = this.resumenPorPaciente();
    return {
      totalFacturado: resumen.reduce((a, r) => a + r.totalFacturado, 0),
      totalPagado: resumen.reduce((a, r) => a + r.totalPagado, 0),
      deudaTotal: resumen.reduce((a, r) => a + r.saldo, 0),
    };
  });

  pagosDe(pacienteId: string) {
    return computed(() =>
      this._pagos()
        .filter((p) => p.pacienteId === pacienteId)
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    );
  }

  /** Tratamientos facturables de un paciente, para asociar un pago a uno puntual (opcional). */
  tratamientosDe(pacienteId: string) {
    return computed(() =>
      this.tratamientosService.tratamientos().filter((t) => t.pacienteId === pacienteId && t.estado !== 'cancelado')
    );
  }

  registrarPago(pacienteId: string, valores: PagoFormValue): void {
    const paciente = this.pacientesService.obtenerPorId(pacienteId);
    const tratamiento = valores.tratamientoId
      ? this.tratamientosService.obtenerPorId(valores.tratamientoId)
      : undefined;

    const nuevo: Pago = {
      id: crypto.randomUUID(),
      pacienteId,
      pacienteNombre: paciente ? nombreCompleto(paciente) : 'Paciente',
      tratamientoId: valores.tratamientoId,
      tratamientoNombre: tratamiento?.nombre,
      monto: valores.monto,
      medioPago: valores.medioPago,
      fecha: valores.fecha,
      notas: valores.notas,
    };

    this._pagos.update((lista) => [nuevo, ...lista]);
  }

  eliminarPago(id: string): void {
    this._pagos.update((lista) => lista.filter((p) => p.id !== id));
  }

  private datosIniciales(): Pago[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

    return [
      { id: 'pg-1', pacienteId: 'p-1', pacienteNombre: 'Martina Gómez', tratamientoId: 'tr-1', tratamientoNombre: 'Tratamiento de ortodoncia', monto: 300000, medioPago: 'transferencia', fecha: dias(-170), notas: 'Adelanto inicial del tratamiento.' },
      { id: 'pg-2', pacienteId: 'p-1', pacienteNombre: 'Martina Gómez', tratamientoId: 'tr-1', tratamientoNombre: 'Tratamiento de ortodoncia', monto: 200000, medioPago: 'tarjeta_debito', fecha: dias(-90) },
      { id: 'pg-3', pacienteId: 'p-2', pacienteNombre: 'Juan Carlos Pérez', tratamientoId: 'tr-2', tratamientoNombre: 'Endodoncia pieza 36', monto: 120000, medioPago: 'efectivo', fecha: dias(-40), notas: 'Pago completo por adelantado.' },
      { id: 'pg-4', pacienteId: 'p-4', pacienteNombre: 'Ignacio Torres', tratamientoId: 'tr-3', tratamientoNombre: 'Implante dental pieza 46', monto: 200000, medioPago: 'tarjeta_credito', fecha: dias(-4), notas: 'Seña para reservar el turno de colocación.' },
    ];
  }
}