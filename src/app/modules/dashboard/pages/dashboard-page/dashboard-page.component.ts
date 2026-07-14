import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';
import { ProximosTurnosComponent } from '../../components/proximos-turnos/proximos-turnos.component';
import { PacientesRecientesComponent } from '../../components/pacientes-recientes/pacientes-recientes.component';
import { ActividadRecienteComponent } from '../../components/actividad-reciente/actividad-reciente.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    ChartCardComponent,
    ProximosTurnosComponent,
    PacientesRecientesComponent,
    ActividadRecienteComponent,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly kpis = this.dashboardService.obtenerKpis();
  readonly proximosTurnos = this.dashboardService.obtenerProximosTurnos();
  readonly pacientesRecientes = this.dashboardService.obtenerPacientesRecientes();
  readonly actividadReciente = this.dashboardService.obtenerActividadReciente();
  readonly graficoIngresos = this.dashboardService.obtenerGraficoIngresos();
  readonly graficoTurnosPorEstado = this.dashboardService.obtenerGraficoTurnosPorEstado();
}
