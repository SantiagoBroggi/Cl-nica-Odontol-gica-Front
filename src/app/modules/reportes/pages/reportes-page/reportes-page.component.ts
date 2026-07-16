import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';

/**
 * Página de Reportes: dashboard estadístico general del consultorio.
 *
 * A diferencia del Dashboard operativo (Etapa 2, pensado para "qué pasa
 * hoy"), esta página mira tendencias (últimos 6 meses) y distribuciones
 * por estado. Es puramente un componente orquestador: todo el cálculo
 * vive en `ReportesService`.
 */
@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule, ChartCardComponent],
  templateUrl: './reportes-page.component.html',
})
export class ReportesPageComponent {
  private readonly reportesService = inject(ReportesService);

  readonly kpis = this.reportesService.kpis;
  readonly graficoNuevosPacientes = this.reportesService.graficoNuevosPacientes;
  readonly graficoIngresos = this.reportesService.graficoIngresos;
  readonly graficoTratamientosPorEstado = this.reportesService.graficoTratamientosPorEstado;
  readonly graficoTurnosPorEstado = this.reportesService.graficoTurnosPorEstado;
}