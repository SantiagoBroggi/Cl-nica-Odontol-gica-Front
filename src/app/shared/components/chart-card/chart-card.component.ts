import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartCardConfig } from '../../interfaces/chart-card-config.interface';

Chart.register(...registerables);

/**
 * Tarjeta reutilizable que envuelve un gráfico de Chart.js.
 *
 * Se maneja el ciclo de vida del `Chart` manualmente (en vez de usar un
 * wrapper de terceros como ng2-charts) para no atarnos a que esa
 * librería mantenga soporte para cada versión nueva de Angular/Chart.js,
 * y porque el control que necesitamos acá es simple: crear el gráfico al
 * montar, redibujarlo si cambia `config`, y destruirlo al desmontar para
 * no filtrar memoria.
 *
 * Se ubica en `shared/components` porque el módulo de Reportes (Etapa 9)
 * va a reutilizar esta misma tarjeta para sus propios gráficos.
 */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) config!: ChartCardConfig;
  /** Alto del canvas en píxeles. Default pensado para grillas de 2 columnas. */
  @Input() alto = 260;

  @ViewChild('canvasRef') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.crearGrafico();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange && this.canvasRef) {
      this.crearGrafico();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private crearGrafico(): void {
    this.chart?.destroy();

    const opcionesComunes: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.config.tipo === 'doughnut' || this.config.tipo === 'pie',
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: 11 } },
        },
      },
      scales:
        this.config.tipo === 'doughnut' || this.config.tipo === 'pie'
          ? undefined
          : {
              y: { grid: { color: '#eef2f6' }, ticks: { font: { size: 11 } } },
              x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            },
    };

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.config.tipo,
      data: this.config.data,
      options: opcionesComunes,
    });
  }
}