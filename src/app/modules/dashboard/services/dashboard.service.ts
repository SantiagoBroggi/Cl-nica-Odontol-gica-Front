import { Injectable } from '@angular/core';
import { KpiCard } from '../models/kpi-card.model';
import { TurnoProximo } from '../models/turno-proximo.model';
import { PacienteReciente } from '../models/paciente-reciente.model';
import { ActividadReciente } from '../models/actividad-reciente.model';
import { ChartCardConfig } from '../../../shared/interfaces/chart-card-config.interface';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private hoy = new Date();

  private horasDesdeHoy(horas: number): Date {
    return new Date(this.hoy.getTime() + horas * 60 * 60 * 1000);
  }

  private diasDesdeHoy(dias: number): Date {
    return new Date(this.hoy.getTime() + dias * 24 * 60 * 60 * 1000);
  }

  obtenerKpis(): KpiCard[] {
    return [
      { id: 'pacientes-activos', etiqueta: 'Pacientes activos', valor: '482', icono: 'groups', variacion: 8.2, variacionLabel: 'vs. mes anterior', colorClase: 'brand' },
      { id: 'turnos-hoy', etiqueta: 'Turnos de hoy', valor: '14', icono: 'calendar_month', variacion: -3.5, variacionLabel: 'vs. mismo día anterior', colorClase: 'amber' },
      { id: 'ingresos-mes', etiqueta: 'Ingresos del mes', valor: '$3.842.500', icono: 'payments', variacion: 12.4, variacionLabel: 'vs. mes anterior', colorClase: 'emerald' },
      { id: 'tratamientos-curso', etiqueta: 'Tratamientos en curso', valor: '37', icono: 'medical_services', variacion: 4.1, variacionLabel: 'vs. mes anterior', colorClase: 'rose' },
    ];
  }

  obtenerProximosTurnos(): TurnoProximo[] {
    return [
      { id: 't-1', pacienteNombre: 'Martina Gómez', pacienteIniciales: 'MG', motivo: 'Control de ortodoncia', fechaHora: this.horasDesdeHoy(1.5), profesional: 'Dra. Lucía Fernández', estado: 'confirmado' },
      { id: 't-2', pacienteNombre: 'Juan Carlos Pérez', pacienteIniciales: 'JP', motivo: 'Endodoncia pieza 36', fechaHora: this.horasDesdeHoy(2.25), profesional: 'Dr. Martín Suárez', estado: 'pendiente' },
      { id: 't-3', pacienteNombre: 'Sofía Ramírez', pacienteIniciales: 'SR', motivo: 'Limpieza y control', fechaHora: this.horasDesdeHoy(3.5), profesional: 'Dra. Lucía Fernández', estado: 'confirmado' },
      { id: 't-4', pacienteNombre: 'Ignacio Torres', pacienteIniciales: 'IT', motivo: 'Colocación de implante', fechaHora: this.diasDesdeHoy(1), profesional: 'Dr. Martín Suárez', estado: 'pendiente' },
      { id: 't-5', pacienteNombre: 'Valentina López', pacienteIniciales: 'VL', motivo: 'Blanqueamiento dental', fechaHora: this.diasDesdeHoy(1.3), profesional: 'Dra. Lucía Fernández', estado: 'ausente' },
    ];
  }

  obtenerPacientesRecientes(): PacienteReciente[] {
    return [
      { id: 'p-1', nombreCompleto: 'Martina Gómez', iniciales: 'MG', ultimaConsulta: this.diasDesdeHoy(-1), tratamientoActivo: 'Ortodoncia' },
      { id: 'p-2', nombreCompleto: 'Juan Carlos Pérez', iniciales: 'JP', ultimaConsulta: this.diasDesdeHoy(-2), tratamientoActivo: 'Endodoncia' },
      { id: 'p-3', nombreCompleto: 'Sofía Ramírez', iniciales: 'SR', ultimaConsulta: this.diasDesdeHoy(-3), tratamientoActivo: 'Control preventivo' },
      { id: 'p-4', nombreCompleto: 'Ignacio Torres', iniciales: 'IT', ultimaConsulta: this.diasDesdeHoy(-4), tratamientoActivo: 'Implante dental' },
      { id: 'p-5', nombreCompleto: 'Camila Díaz', iniciales: 'CD', ultimaConsulta: this.diasDesdeHoy(-5), tratamientoActivo: 'Blanqueamiento' },
    ];
  }

  obtenerActividadReciente(): ActividadReciente[] {
    return [
      { id: 'a-1', tipo: 'pago', icono: 'payments', descripcion: 'Se registró un pago de $45.000 de Martina Gómez.', autor: 'Recepción', fecha: this.horasDesdeHoy(-0.5) },
      { id: 'a-2', tipo: 'turno', icono: 'event_available', descripcion: 'Nuevo turno confirmado para Juan Carlos Pérez.', autor: 'Recepción', fecha: this.horasDesdeHoy(-1.2) },
      { id: 'a-3', tipo: 'historia-clinica', icono: 'folder_shared', descripcion: 'Se actualizó la historia clínica de Sofía Ramírez.', autor: 'Dra. Lucía Fernández', fecha: this.horasDesdeHoy(-3) },
      { id: 'a-4', tipo: 'tratamiento', icono: 'medical_services', descripcion: 'Se marcó como finalizada la etapa 2 del tratamiento de Ignacio Torres.', autor: 'Dr. Martín Suárez', fecha: this.horasDesdeHoy(-5.5) },
      { id: 'a-5', tipo: 'paciente', icono: 'person_add', descripcion: 'Se dio de alta un nuevo paciente: Camila Díaz.', autor: 'Recepción', fecha: this.diasDesdeHoy(-1) },
    ];
  }

  obtenerGraficoIngresos(): ChartCardConfig {
    return {
      tipo: 'line',
      titulo: 'Ingresos de los últimos 6 meses',
      subtitulo: 'Montos en pesos argentinos',
      data: {
        labels: ['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
        datasets: [{
          label: 'Ingresos',
          data: [2_450_000, 2_680_000, 2_990_000, 3_120_000, 3_410_000, 3_842_500],
          borderColor: '#195677',
          backgroundColor: 'rgba(38, 136, 179, 0.15)',
          pointBackgroundColor: '#195677',
          tension: 0.35,
          fill: true,
        }],
      },
    };
  }

  obtenerGraficoTurnosPorEstado(): ChartCardConfig {
    return {
      tipo: 'doughnut',
      titulo: 'Turnos de la semana por estado',
      data: {
        labels: ['Confirmados', 'Pendientes', 'Atendidos', 'Cancelados', 'Ausentes'],
        datasets: [{
          data: [32, 18, 41, 6, 4],
          backgroundColor: ['#2688b3', '#82c5e0', '#195677', '#f59e0b', '#e11d48'],
          borderWidth: 0,
        }],
      },
    };
  }
}