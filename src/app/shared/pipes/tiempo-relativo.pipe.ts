import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea una fecha como tiempo relativo en español ("hace 2 horas",
 * "en 3 días", "hace un momento").
 *
 * Se ubica en `shared/pipes` (y no dentro de `modules/dashboard`) porque
 * lo van a necesitar varios módulos: el dashboard (actividad reciente,
 * pacientes recientes), la agenda (Etapa 4) y la historia clínica
 * (Etapa 5).
 */
@Pipe({
  name: 'tiempoRelativo',
  standalone: true,
})
export class TiempoRelativoPipe implements PipeTransform {
  transform(valor: Date | string | null | undefined): string {
    if (!valor) {
      return '';
    }

    const fecha = valor instanceof Date ? valor : new Date(valor);
    const diferenciaMs = fecha.getTime() - Date.now();
    const diferenciaMin = Math.round(diferenciaMs / 60_000);

    const esFuturo = diferenciaMin > 0;
    const minAbs = Math.abs(diferenciaMin);

    if (minAbs < 1) {
      return 'ahora mismo';
    }
    if (minAbs < 60) {
      return esFuturo ? `en ${minAbs} min` : `hace ${minAbs} min`;
    }

    const horas = Math.round(minAbs / 60);
    if (horas < 24) {
      const unidad = horas === 1 ? 'hora' : 'horas';
      return esFuturo ? `en ${horas} ${unidad}` : `hace ${horas} ${unidad}`;
    }

    const dias = Math.round(horas / 24);
    const unidadDias = dias === 1 ? 'día' : 'días';
    return esFuturo ? `en ${dias} ${unidadDias}` : `hace ${dias} ${unidadDias}`;
  }
}