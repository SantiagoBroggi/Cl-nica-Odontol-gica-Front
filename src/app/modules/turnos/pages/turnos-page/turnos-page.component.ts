import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../models/turno.model';
import { ESTADO_TURNO_CONFIG, EstadoTurno } from '../../../../shared/interfaces/estado-turno.interface';
import {
  TurnoFormDialogComponent,
  TurnoFormDialogData,
} from '../../components/turno-form-dialog/turno-form-dialog.component';

/**
 * Colores hexadecimales por estado, usados solo para pintar los eventos
 * del calendario (FullCalendar necesita colores reales, no clases de
 * Tailwind). Se mantienen coherentes con la paleta de
 * `ESTADO_TURNO_CONFIG` en `shared/interfaces`.
 */
const ESTADO_COLOR_HEX: Record<EstadoTurno, string> = {
  pendiente: '#f59e0b',
  confirmado: '#2688b3',
  atendido: '#059669',
  cancelado: '#e11d48',
  ausente: '#64748b',
};

@Component({
  selector: 'app-turnos-page',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatButtonModule],
  templateUrl: './turnos-page.component.html',
})
export class TurnosPageComponent {
  private readonly turnosService = inject(TurnosService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly leyendaEstados = Object.entries(ESTADO_TURNO_CONFIG) as [EstadoTurno, { label: string }][];
  readonly colorEstado = ESTADO_COLOR_HEX;

  /**
   * Opciones del calendario, recalculadas cada vez que cambian los
   * turnos (signal). FullCalendar aplica el nuevo `events` sin perder la
   * vista/fecha actual del usuario.
   */
  readonly calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', list: 'Lista' },
    height: 'auto',
    nowIndicator: true,
    selectable: true,
    dayMaxEvents: 3,
    events: this.mapearEventos(this.turnosService.turnos()),
    dateClick: (info: DateClickArg) => this.onDateClick(info),
    eventClick: (info: EventClickArg) => this.onEventClick(info),
  }));

  abrirNuevoTurno(): void {
    this.abrirDialogo(null);
  }

  private onDateClick(info: DateClickArg): void {
    this.abrirDialogo(null, info.date);
  }

  private onEventClick(info: EventClickArg): void {
    const turno = this.turnosService.obtenerPorId(info.event.id);
    if (turno) {
      this.abrirDialogo(turno);
    }
  }

  private abrirDialogo(turno: Turno | null, fechaSugerida?: Date): void {
    const ref = this.dialog.open<TurnoFormDialogComponent, TurnoFormDialogData>(TurnoFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      data: { turno, fechaSugerida },
    });

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;

      if (turno) {
        this.turnosService.actualizar(turno.id, valores);
        this.snackBar.open('Turno actualizado correctamente.', 'Cerrar', { duration: 3000 });
      } else {
        this.turnosService.crear(valores);
        this.snackBar.open('Turno creado correctamente.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private mapearEventos(turnos: Turno[]): EventInput[] {
    return turnos.map((turno) => ({
      id: turno.id,
      title: `${turno.pacienteNombre} · ${turno.motivo}`,
      start: turno.inicio,
      end: turno.fin,
      backgroundColor: ESTADO_COLOR_HEX[turno.estado],
      borderColor: ESTADO_COLOR_HEX[turno.estado],
    }));
  }
}