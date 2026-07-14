import { Injectable, computed, signal } from '@angular/core';
import { Paciente, PacienteFormValue } from '../models/paciente.model';

export type FiltroTurno = 'todos' | 'con-proximo-turno' | 'sin-proximo-turno';

/**
 * Fuente de datos + estado de UI (búsqueda, filtro) del listado de
 * pacientes.
 *
 * Guarda los pacientes en un signal en memoria a modo de mock. La
 * superficie pública (`pacientesFiltrados`, `crear`, `actualizar`,
 * `eliminar`) es la misma que tendría un servicio real conectado a
 * FastAPI (`GET/POST/PUT/DELETE /pacientes`), para que reemplazar la
 * implementación interna por `HttpClient` no obligue a tocar los
 * componentes que lo consumen.
 */
@Injectable({ providedIn: 'root' })
export class PacientesService {
  private readonly _pacientes = signal<Paciente[]>(this.datosIniciales());
  private readonly _busqueda = signal<string>('');
  private readonly _filtroTurno = signal<FiltroTurno>('todos');

  readonly busqueda = this._busqueda.asReadonly();
  readonly filtroTurno = this._filtroTurno.asReadonly();
  readonly totalPacientes = computed(() => this._pacientes().length);

  /** Lista de pacientes ya filtrada por búsqueda de texto + filtro de turno. */
  readonly pacientesFiltrados = computed(() => {
    const termino = this._busqueda().trim().toLowerCase();
    const filtro = this._filtroTurno();

    return this._pacientes().filter((paciente) => {
      const coincideTexto =
        termino.length === 0 ||
        `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(termino) ||
        paciente.dni.includes(termino) ||
        paciente.telefono.includes(termino);

      const coincideFiltro =
        filtro === 'todos' ||
        (filtro === 'con-proximo-turno' && paciente.proximoTurno !== null) ||
        (filtro === 'sin-proximo-turno' && paciente.proximoTurno === null);

      return coincideTexto && coincideFiltro;
    });
  });

  setBusqueda(termino: string): void {
    this._busqueda.set(termino);
  }

  setFiltroTurno(filtro: FiltroTurno): void {
    this._filtroTurno.set(filtro);
  }

  obtenerPorId(id: string): Paciente | undefined {
    return this._pacientes().find((p) => p.id === id);
  }

  crear(valores: PacienteFormValue): void {
    const nuevo: Paciente = {
      ...valores,
      id: crypto.randomUUID(),
      ultimaConsulta: null,
      proximoTurno: null,
      creadoEl: new Date(),
    };
    this._pacientes.update((lista) => [nuevo, ...lista]);
  }

  actualizar(id: string, valores: PacienteFormValue): void {
    this._pacientes.update((lista) =>
      lista.map((paciente) => (paciente.id === id ? { ...paciente, ...valores } : paciente))
    );
  }

  eliminar(id: string): void {
    this._pacientes.update((lista) => lista.filter((paciente) => paciente.id !== id));
  }

  private datosIniciales(): Paciente[] {
    const dias = (offset: number) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
    const anios = (offset: number) => new Date(Date.now() + offset * 365 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'p-1',
        nombre: 'Martina',
        apellido: 'Gómez',
        dni: '38452167',
        telefono: '+54 351 555-0142',
        email: 'martina.gomez@example.com',
        fechaNacimiento: anios(-24),
        obraSocial: 'OSDE',
        direccion: 'Av. Colón 1234, Córdoba',
        ultimaConsulta: dias(-1),
        proximoTurno: dias(0.06),
        creadoEl: dias(-200),
      },
      {
        id: 'p-2',
        nombre: 'Juan Carlos',
        apellido: 'Pérez',
        dni: '29876541',
        telefono: '+54 351 555-0198',
        email: 'jc.perez@example.com',
        fechaNacimiento: anios(-45),
        obraSocial: 'Swiss Medical',
        ultimaConsulta: dias(-2),
        proximoTurno: dias(0.1),
        creadoEl: dias(-540),
      },
      {
        id: 'p-3',
        nombre: 'Sofía',
        apellido: 'Ramírez',
        dni: '41234567',
        telefono: '+54 351 555-0176',
        fechaNacimiento: anios(-19),
        obraSocial: 'Particular',
        ultimaConsulta: dias(-3),
        proximoTurno: dias(0.15),
        creadoEl: dias(-90),
      },
      {
        id: 'p-4',
        nombre: 'Ignacio',
        apellido: 'Torres',
        dni: '33654987',
        telefono: '+54 351 555-0110',
        email: 'i.torres@example.com',
        fechaNacimiento: anios(-52),
        obraSocial: 'IOSCOR',
        ultimaConsulta: dias(-4),
        proximoTurno: dias(1),
        creadoEl: dias(-720),
      },
      {
        id: 'p-5',
        nombre: 'Camila',
        apellido: 'Díaz',
        dni: '40112233',
        telefono: '+54 351 555-0155',
        fechaNacimiento: anios(-27),
        obraSocial: 'Particular',
        ultimaConsulta: dias(-5),
        proximoTurno: null,
        creadoEl: dias(-30),
      },
      {
        id: 'p-6',
        nombre: 'Valentina',
        apellido: 'López',
        dni: '36998211',
        telefono: '+54 351 555-0133',
        email: 'vale.lopez@example.com',
        fechaNacimiento: anios(-31),
        obraSocial: 'OSDE',
        ultimaConsulta: dias(-10),
        proximoTurno: dias(1.3),
        creadoEl: dias(-400),
      },
      {
        id: 'p-7',
        nombre: 'Mateo',
        apellido: 'Fernández',
        dni: '45001122',
        telefono: '+54 351 555-0121',
        fechaNacimiento: anios(-8),
        obraSocial: 'Swiss Medical',
        ultimaConsulta: dias(-15),
        proximoTurno: null,
        creadoEl: dias(-60),
      },
      {
        id: 'p-8',
        nombre: 'Lucía',
        apellido: 'Sánchez',
        dni: '32456789',
        telefono: '+54 351 555-0188',
        email: 'lucia.sanchez@example.com',
        fechaNacimiento: anios(-38),
        obraSocial: 'Particular',
        ultimaConsulta: dias(-20),
        proximoTurno: null,
        creadoEl: dias(-980),
      },
    ];
  }
}
