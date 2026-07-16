import { Injectable, computed, inject } from '@angular/core';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { TurnosService } from '../../turnos/services/turnos.service';
import { TratamientosService } from '../../tratamientos/services/tratamientos.service';
import { FacturacionService } from '../../facturacion/services/facturacion.service';
import { ESTADO_TURNO_CONFIG, EstadoTurno } from '../../../shared/interfaces/estado-turno.interface';
import { ESTADO_TRATAMIENTO_CONFIG, EstadoTratamiento } from '../../tratamientos/models/tratamiento.model';
import { ChartCardConfig } from '../../../shared/interfaces/chart-card-config.interface';

/** Colores hex para los gráficos (Chart.js necesita colores reales, no clases de Tailwind). */
const COLOR_TURNO: Record<EstadoTurno, string> = {
  pendiente: '#f59e0b',
  confirmado: '#2688b3',
  atendido: '#059669',
  cancelado: '#e11d48',
  ausente: '#64748b',
};

const COLOR_TRATAMIENTO: Record<EstadoTratamiento, string> = {
  planificado: '#f59e0b',
  'en-curso': '#2688b3',
  finalizado: '#059669',
  cancelado: '#e11d48',
};

/**
 * Fuente de datos de Reportes.
 *
 * No guarda nada propio: toma los signals de los otros 4 servicios y los
 * agrega (conteos, sumas, agrupación por mes) con `computed()`. Como
 * consecuencia, cualquier alta/edición en Pacientes, Turnos, Tratamientos
 * o Facturación se refleja acá solo, sin tener que "recalcular" nada a mano.
 */
@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly pacientesService = inject(PacientesService);
  private readonly turnosService = inject(TurnosService);
  private readonly tratamientosService = inject(TratamientosService);
  private readonly facturacionService = inject(FacturacionService);

  /** Últimos `cantidad` meses (más antiguo primero), con etiqueta corta en español. */
  private ultimosMeses(cantidad: number): { etiqueta: string; anio: number; mes: number }[] {
    const nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const hoy = new Date();
    const meses = [];
    for (let i = cantidad - 1; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      meses.push({ etiqueta: nombres[fecha.getMonth()], anio: fecha.getFullYear(), mes: fecha.getMonth() });
    }
    return meses;
  }

  readonly kpis = computed(() => {
    const hoy = new Date();
    const pacientes = this.pacientesService.pacientesFiltrados();
    const turnos = this.turnosService.turnos();
    const pagos = this.facturacionService.pagos();

    const esEsteMes = (fecha: Date) => fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === hoy.getMonth();

    return {
      totalPacientes: pacientes.length,
      nuevosEsteMes: pacientes.filter((p) => esEsteMes(p.creadoEl)).length,
      ingresosEsteMes: pagos.filter((p) => esEsteMes(p.fecha)).reduce((acum, p) => acum + p.monto, 0),
      turnosEsteMes: turnos.filter((t) => esEsteMes(t.inicio)).length,
    };
  });

  readonly graficoNuevosPacientes = computed<ChartCardConfig>(() => {
    const meses = this.ultimosMeses(6);
    const pacientes = this.pacientesService.pacientesFiltrados();

    const datos = meses.map(
      ({ anio, mes }) =>
        pacientes.filter((p) => p.creadoEl.getFullYear() === anio && p.creadoEl.getMonth() === mes).length
    );

    return {
      tipo: 'bar',
      titulo: 'Nuevos pacientes por mes',
      subtitulo: 'Últimos 6 meses',
      data: {
        labels: meses.map((m) => m.etiqueta),
        datasets: [{ label: 'Nuevos pacientes', data: datos, backgroundColor: '#2688b3', borderRadius: 4 }],
      },
    };
  });

  readonly graficoIngresos = computed<ChartCardConfig>(() => {
    const meses = this.ultimosMeses(6);
    const pagos = this.facturacionService.pagos();

    const datos = meses.map(({ anio, mes }) =>
      pagos
        .filter((p) => p.fecha.getFullYear() === anio && p.fecha.getMonth() === mes)
        .reduce((acum, p) => acum + p.monto, 0)
    );

    return {
      tipo: 'line',
      titulo: 'Ingresos por mes',
      subtitulo: 'Últimos 6 meses, en pesos',
      data: {
        labels: meses.map((m) => m.etiqueta),
        datasets: [
          {
            label: 'Ingresos',
            data: datos,
            borderColor: '#195677',
            backgroundColor: 'rgba(38, 136, 179, 0.15)',
            tension: 0.35,
            fill: true,
          },
        ],
      },
    };
  });

  readonly graficoTratamientosPorEstado = computed<ChartCardConfig>(() => {
    const tratamientos = this.tratamientosService.tratamientos();
    const estados = Object.keys(ESTADO_TRATAMIENTO_CONFIG) as EstadoTratamiento[];

    return {
      tipo: 'doughnut',
      titulo: 'Tratamientos por estado',
      data: {
        labels: estados.map((e) => ESTADO_TRATAMIENTO_CONFIG[e].label),
        datasets: [
          {
            data: estados.map((e) => tratamientos.filter((t) => t.estado === e).length),
            backgroundColor: estados.map((e) => COLOR_TRATAMIENTO[e]),
            borderWidth: 0,
          },
        ],
      },
    };
  });

  readonly graficoTurnosPorEstado = computed<ChartCardConfig>(() => {
    const turnos = this.turnosService.turnos();
    const estados = Object.keys(ESTADO_TURNO_CONFIG) as EstadoTurno[];

    return {
      tipo: 'doughnut',
      titulo: 'Turnos por estado',
      data: {
        labels: estados.map((e) => ESTADO_TURNO_CONFIG[e].label),
        datasets: [
          {
            data: estados.map((e) => turnos.filter((t) => t.estado === e).length),
            backgroundColor: estados.map((e) => COLOR_TURNO[e]),
            borderWidth: 0,
          },
        ],
      },
    };
  });
}