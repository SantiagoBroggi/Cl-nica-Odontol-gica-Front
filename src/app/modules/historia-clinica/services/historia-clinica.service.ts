import { Injectable, signal } from '@angular/core';
import { AntecedentesMedicos, AntecedentesFormValue } from '../models/antecedentes.model';
import { Consulta, ConsultaFormValue } from '../models/consulta.model';

/**
 * Fuente de datos de Historia Clínica.
 *
 * Guarda dos colecciones independientes en memoria: un antecedente por
 * paciente (registro único, se actualiza in-place) y una lista de
 * consultas (histórico, se va agregando). Los componentes filtran por
 * `pacienteId` con un `computed()` propio a partir de las señales
 * públicas de acá, así que este servicio no necesita saber "para qué
 * paciente" lo están mirando en cada momento.
 */
@Injectable({ providedIn: 'root' })
export class HistoriaClinicaService {
  private readonly _antecedentes = signal<AntecedentesMedicos[]>(this.antecedentesIniciales());
  private readonly _consultas = signal<Consulta[]>(this.consultasIniciales());

  readonly antecedentes = this._antecedentes.asReadonly();
  readonly consultas = this._consultas.asReadonly();

  obtenerAntecedentes(pacienteId: string): AntecedentesMedicos | undefined {
    return this._antecedentes().find((a) => a.pacienteId === pacienteId);
  }

  guardarAntecedentes(pacienteId: string, valores: AntecedentesFormValue): void {
    const existente = this.obtenerAntecedentes(pacienteId);

    if (existente) {
      this._antecedentes.update((lista) =>
        lista.map((a) => (a.pacienteId === pacienteId ? { ...a, ...valores, actualizadoEl: new Date() } : a))
      );
    } else {
      this._antecedentes.update((lista) => [
        ...lista,
        { pacienteId, ...valores, actualizadoEl: new Date() },
      ]);
    }
  }

  crearConsulta(pacienteId: string, valores: ConsultaFormValue): void {
    const nueva: Consulta = { id: crypto.randomUUID(), pacienteId, ...valores };
    this._consultas.update((lista) => [nueva, ...lista]);
  }

  eliminarConsulta(id: string): void {
    this._consultas.update((lista) => lista.filter((c) => c.id !== id));
  }

  private antecedentesIniciales(): AntecedentesMedicos[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

    return [
      { pacienteId: 'p-1', alergias: 'Penicilina', medicacionActual: 'Ninguna', enfermedadesPreexistentes: 'Ninguna', cirugiasPrevias: 'Extracción de muelas de juicio (2021)', habitos: 'No fuma', observaciones: 'Paciente colaboradora, buena higiene oral.', actualizadoEl: dias(-30) },
      { pacienteId: 'p-2', alergias: 'Ninguna conocida', medicacionActual: 'Losartán 50mg (hipertensión)', enfermedadesPreexistentes: 'Hipertensión arterial', cirugiasPrevias: 'Ninguna', habitos: 'Fumador ocasional', observaciones: 'Controlar presión antes de procedimientos invasivos.', actualizadoEl: dias(-60) },
      { pacienteId: 'p-3', alergias: 'Látex', medicacionActual: 'Ninguna', enfermedadesPreexistentes: 'Ninguna', cirugiasPrevias: 'Ninguna', habitos: 'No fuma', observaciones: 'Usar guantes sin látex en todos los procedimientos.', actualizadoEl: dias(-10) },
    ];
  }

  private consultasIniciales(): Consulta[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

    return [
      { id: 'c-1', pacienteId: 'p-1', fecha: dias(-90), motivo: 'Control de ortodoncia', diagnostico: 'Alineación en progreso, evolución favorable', tratamientoRealizado: 'Ajuste de brackets y cambio de ligaduras', profesional: 'Dra. Lucía Fernández', notas: 'Próximo control en 6 semanas.' },
      { id: 'c-2', pacienteId: 'p-1', fecha: dias(-30), motivo: 'Control de ortodoncia', diagnostico: 'Buena evolución, sin molestias', tratamientoRealizado: 'Ajuste de brackets', profesional: 'Dra. Lucía Fernández' },
      { id: 'c-3', pacienteId: 'p-1', fecha: dias(-1), motivo: 'Control de ortodoncia', diagnostico: 'Alineación dentro de lo esperado', tratamientoRealizado: 'Ajuste de brackets y control fotográfico', profesional: 'Dra. Lucía Fernández' },
      { id: 'c-4', pacienteId: 'p-2', fecha: dias(-45), motivo: 'Dolor en pieza 36', diagnostico: 'Caries profunda con compromiso pulpar', tratamientoRealizado: 'Inicio de endodoncia, primera sesión', profesional: 'Dr. Martín Suárez', notas: 'Paciente refiere dolor al masticar. Se indica analgésico.' },
      { id: 'c-5', pacienteId: 'p-2', fecha: dias(-15), motivo: 'Continuación de endodoncia pieza 36', diagnostico: 'Conducto limpio, sin signos de infección', tratamientoRealizado: 'Obturación de conductos', profesional: 'Dr. Martín Suárez' },
      { id: 'c-6', pacienteId: 'p-3', fecha: dias(-10), motivo: 'Limpieza y control', diagnostico: 'Gingivitis leve', tratamientoRealizado: 'Destartraje y pulido dental', profesional: 'Dra. Lucía Fernández', notas: 'Reforzar técnica de cepillado e hilo dental.' },
    ];
  }
}