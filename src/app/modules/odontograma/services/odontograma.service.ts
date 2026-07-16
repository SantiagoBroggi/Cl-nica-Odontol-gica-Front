import { Injectable, computed, signal } from '@angular/core';
import { DienteEstado, EstadoDiente, ARCADA_SUPERIOR, ARCADA_INFERIOR } from '../models/diente.model';

/**
 * Fuente de datos del Odontograma.
 *
 * Guarda una lista plana de `DienteEstado` (una entrada por cada pieza
 * que tiene un estado distinto de "Sano" registrado) en vez de una
 * matriz de 32 posiciones por paciente: así el mock solo necesita datos
 * para las piezas "interesantes", y cualquier diente sin entrada se
 * asume Sano por default (ver `obtenerEstado`).
 */
@Injectable({ providedIn: 'root' })
export class OdontogramaService {
  private readonly _registros = signal<DienteEstado[]>(this.datosIniciales());
  readonly registros = this._registros.asReadonly();

  /** Todas las piezas (superior + inferior) en el orden en que se dibujan. */
  readonly numerosDientes = [...ARCADA_SUPERIOR, ...ARCADA_INFERIOR];

  /** Mapa numero -> DienteEstado para un paciente, ya resuelto con default "sano". */
  odontogramaDe(pacienteId: string) {
    return computed(() => {
      const registrosPaciente = this._registros().filter((r) => r.pacienteId === pacienteId);
      const mapa = new Map(registrosPaciente.map((r) => [r.numero, r]));

      return this.numerosDientes.map(
        (numero) =>
          mapa.get(numero) ?? {
            pacienteId,
            numero,
            estado: 'sano' as EstadoDiente,
            actualizadoEl: new Date(0),
          }
      );
    });
  }

  actualizarDiente(pacienteId: string, numero: number, estado: EstadoDiente, notas?: string): void {
    const existe = this._registros().some((r) => r.pacienteId === pacienteId && r.numero === numero);

    if (existe) {
      this._registros.update((lista) =>
        lista.map((r) =>
          r.pacienteId === pacienteId && r.numero === numero
            ? { ...r, estado, notas, actualizadoEl: new Date() }
            : r
        )
      );
    } else {
      this._registros.update((lista) => [
        ...lista,
        { pacienteId, numero, estado, notas, actualizadoEl: new Date() },
      ]);
    }
  }

  private datosIniciales(): DienteEstado[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

    return [
      { pacienteId: 'p-1', numero: 16, estado: 'restauracion', notas: 'Resina compuesta, cara oclusal.', actualizadoEl: dias(-120) },
      { pacienteId: 'p-1', numero: 26, estado: 'restauracion', notas: 'Resina compuesta, cara oclusal.', actualizadoEl: dias(-120) },
      { pacienteId: 'p-1', numero: 18, estado: 'extraccion', notas: 'Extraída por falta de espacio (ortodoncia).', actualizadoEl: dias(-200) },
      { pacienteId: 'p-1', numero: 28, estado: 'extraccion', notas: 'Extraída por falta de espacio (ortodoncia).', actualizadoEl: dias(-200) },
      { pacienteId: 'p-2', numero: 36, estado: 'caries', notas: 'Caries profunda, en tratamiento de endodoncia.', actualizadoEl: dias(-15) },
      { pacienteId: 'p-2', numero: 46, estado: 'corona', notas: 'Corona de porcelana colocada en 2022.', actualizadoEl: dias(-400) },
      { pacienteId: 'p-3', numero: 11, estado: 'caries', notas: 'Caries incipiente, a controlar.', actualizadoEl: dias(-10) },
      { pacienteId: 'p-4', numero: 46, estado: 'implante', notas: 'Implante colocado, en etapa de oseointegración.', actualizadoEl: dias(-5) },
    ];
  }
}