import { Injectable, computed, inject, signal } from '@angular/core';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { nombreCompleto } from '../../pacientes/models/paciente.model';
import { PROFESIONALES } from '../../turnos/models/turno.model';
import { EstadoTratamiento, Tratamiento, TratamientoFormValue } from '../models/tratamiento.model';

export type FiltroEstadoTratamiento = 'todos' | EstadoTratamiento;

/**
 * Fuente de datos de Tratamientos.
 *
 * Mismo patrón que `TurnosService` (Etapa 4): se apoya en
 * `PacientesService` para los datos reales de paciente, y expone
 * `profesionales` reutilizando la lista de Turnos en vez de duplicarla.
 */
@Injectable({ providedIn: 'root' })
export class TratamientosService {
  private readonly pacientesService = inject(PacientesService);

  private readonly _tratamientos = signal<Tratamiento[]>(this.datosIniciales());
  private readonly _busqueda = signal<string>('');
  private readonly _filtroEstado = signal<FiltroEstadoTratamiento>('todos');

  /**
   * Lista completa sin filtrar. Se usa desde otros módulos (ej:
   * Facturación) que necesitan TODOS los tratamientos para calcular
   * totales, independientemente de qué búsqueda/filtro haya quedado
   * seteado en la página de Tratamientos.
   */
  readonly tratamientos = this._tratamientos.asReadonly();

  readonly busqueda = this._busqueda.asReadonly();
  readonly filtroEstado = this._filtroEstado.asReadonly();
  readonly profesionales = PROFESIONALES;

  readonly pacientesDisponibles = computed(() =>
    this.pacientesService.pacientesFiltrados().map((p) => ({ id: p.id, nombre: nombreCompleto(p) }))
  );

  readonly tratamientosFiltrados = computed(() => {
    const termino = this._busqueda().trim().toLowerCase();
    const filtro = this._filtroEstado();

    return this._tratamientos().filter((t) => {
      const coincideTexto =
        termino.length === 0 ||
        t.pacienteNombre.toLowerCase().includes(termino) ||
        t.nombre.toLowerCase().includes(termino);
      const coincideFiltro = filtro === 'todos' || t.estado === filtro;
      return coincideTexto && coincideFiltro;
    });
  });

  setBusqueda(termino: string): void {
    this._busqueda.set(termino);
  }

  setFiltroEstado(filtro: FiltroEstadoTratamiento): void {
    this._filtroEstado.set(filtro);
  }

  obtenerPorId(id: string): Tratamiento | undefined {
    return this._tratamientos().find((t) => t.id === id);
  }

  crear(valores: TratamientoFormValue): void {
    const paciente = this.pacientesService.obtenerPorId(valores.pacienteId);
    const nuevo: Tratamiento = {
      id: crypto.randomUUID(),
      pacienteNombre: paciente ? nombreCompleto(paciente) : 'Paciente',
      etapas: [],
      creadoEl: new Date(),
      ...valores,
    };
    this._tratamientos.update((lista) => [nuevo, ...lista]);
  }

  actualizar(id: string, valores: TratamientoFormValue): void {
    const paciente = this.pacientesService.obtenerPorId(valores.pacienteId);
    this._tratamientos.update((lista) =>
      lista.map((t) =>
        t.id === id
          ? { ...t, ...valores, pacienteNombre: paciente ? nombreCompleto(paciente) : t.pacienteNombre }
          : t
      )
    );
  }

  eliminar(id: string): void {
    this._tratamientos.update((lista) => lista.filter((t) => t.id !== id));
  }

  agregarEtapa(tratamientoId: string, nombre: string): void {
    this._tratamientos.update((lista) =>
      lista.map((t) =>
        t.id === tratamientoId
          ? { ...t, etapas: [...t.etapas, { id: crypto.randomUUID(), nombre, completada: false }] }
          : t
      )
    );
  }

  toggleEtapa(tratamientoId: string, etapaId: string): void {
    this._tratamientos.update((lista) =>
      lista.map((t) =>
        t.id === tratamientoId
          ? {
              ...t,
              etapas: t.etapas.map((e) =>
                e.id === etapaId ? { ...e, completada: !e.completada, fecha: !e.completada ? new Date() : undefined } : e
              ),
            }
          : t
      )
    );
  }

  eliminarEtapa(tratamientoId: string, etapaId: string): void {
    this._tratamientos.update((lista) =>
      lista.map((t) => (t.id === tratamientoId ? { ...t, etapas: t.etapas.filter((e) => e.id !== etapaId) } : t))
    );
  }

  private datosIniciales(): Tratamiento[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
    const pacientes = this.pacientesService.pacientesFiltrados();
    const nombre = (id: string, fallback: string) => {
      const p = pacientes.find((x) => x.id === id);
      return p ? nombreCompleto(p) : fallback;
    };

    return [
      {
        id: 'tr-1', pacienteId: 'p-1', pacienteNombre: nombre('p-1', 'Martina Gómez'),
        nombre: 'Tratamiento de ortodoncia', descripcion: 'Corrección de alineación con brackets metálicos.',
        profesional: 'Dra. Lucía Fernández', estado: 'en-curso', costoTotal: 850000, fechaInicio: dias(-180), creadoEl: dias(-180),
        etapas: [
          { id: 'e-1', nombre: 'Colocación de brackets', completada: true, fecha: dias(-180) },
          { id: 'e-2', nombre: 'Control mensual - mes 1', completada: true, fecha: dias(-150) },
          { id: 'e-3', nombre: 'Control mensual - mes 2', completada: true, fecha: dias(-120) },
          { id: 'e-4', nombre: 'Control mensual - mes 3', completada: false },
          { id: 'e-5', nombre: 'Retiro de brackets', completada: false },
        ],
      },
      {
        id: 'tr-2', pacienteId: 'p-2', pacienteNombre: nombre('p-2', 'Juan Carlos Pérez'),
        nombre: 'Endodoncia pieza 36', descripcion: 'Tratamiento de conducto por caries profunda.',
        profesional: 'Dr. Martín Suárez', estado: 'en-curso', costoTotal: 120000, fechaInicio: dias(-45), creadoEl: dias(-45),
        etapas: [
          { id: 'e-6', nombre: 'Apertura y limpieza de conductos', completada: true, fecha: dias(-45) },
          { id: 'e-7', nombre: 'Obturación de conductos', completada: true, fecha: dias(-15) },
          { id: 'e-8', nombre: 'Colocación de corona', completada: false },
        ],
      },
      {
        id: 'tr-3', pacienteId: 'p-4', pacienteNombre: nombre('p-4', 'Ignacio Torres'),
        nombre: 'Implante dental pieza 46', descripcion: 'Colocación de implante y corona definitiva.',
        profesional: 'Dr. Martín Suárez', estado: 'planificado', costoTotal: 650000, fechaInicio: dias(2), creadoEl: dias(-5),
        etapas: [{ id: 'e-9', nombre: 'Colocación de implante', completada: false }],
      },
      {
        id: 'tr-4', pacienteId: 'p-3', pacienteNombre: nombre('p-3', 'Sofía Ramírez'),
        nombre: 'Blanqueamiento dental', profesional: 'Dra. Lucía Fernández',
        estado: 'finalizado', costoTotal: 90000, fechaInicio: dias(-60), creadoEl: dias(-60),
        etapas: [{ id: 'e-10', nombre: 'Sesión única de blanqueamiento', completada: true, fecha: dias(-60) }],
      },
    ];
  }
}