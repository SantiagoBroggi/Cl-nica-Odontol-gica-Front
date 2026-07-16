/**
 * Medio de pago utilizado en un pago registrado.
 */
export type MedioPago = 'efectivo' | 'tarjeta_debito' | 'tarjeta_credito' | 'transferencia';

export const MEDIO_PAGO_LABELS: Record<MedioPago, string> = {
  efectivo: 'Efectivo',
  tarjeta_debito: 'Tarjeta de débito',
  tarjeta_credito: 'Tarjeta de crédito',
  transferencia: 'Transferencia',
};

/**
 * Un pago registrado por un paciente.
 *
 * `tratamientoId`/`tratamientoNombre` son opcionales porque un pago
 * puede ser "a cuenta" (adelanto general) sin estar atado a un
 * tratamiento puntual — por eso no es una referencia obligatoria.
 */
export interface Pago {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tratamientoId?: string;
  tratamientoNombre?: string;
  monto: number;
  medioPago: MedioPago;
  fecha: Date;
  notas?: string;
}

/** Forma de los datos que vienen del formulario reactivo de alta de pago. */
export type PagoFormValue = Pick<Pago, 'tratamientoId' | 'monto' | 'medioPago' | 'fecha' | 'notas'>;

/**
 * Resumen de cuenta corriente de un paciente: cuánto se le facturó
 * (suma de `costoTotal` de sus tratamientos), cuánto pagó, y el saldo
 * pendiente. Se calcula en `FacturacionService`, no se persiste.
 */
export interface ResumenCuentaPaciente {
  pacienteId: string;
  pacienteNombre: string;
  totalFacturado: number;
  totalPagado: number;
  saldo: number;
}