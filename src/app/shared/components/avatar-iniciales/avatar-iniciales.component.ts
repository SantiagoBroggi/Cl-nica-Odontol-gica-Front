import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Avatar circular con iniciales, coloreado de forma determinística según
 * el texto recibido (mismo nombre => siempre el mismo color).
 *
 * Se usa como reemplazo de una foto real de perfil en toda la app
 * (pacientes, navbar, próximos turnos, etc.) mientras no haya carga de
 * imágenes contra el backend.
 */
@Component({
  selector: 'app-avatar-iniciales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex shrink-0 items-center justify-center rounded-full font-semibold"
      [class]="claseColor"
      [style.width.px]="tamano"
      [style.height.px]="tamano"
      [style.fontSize.px]="tamano * 0.38"
    >
      {{ iniciales }}
    </div>
  `,
})
export class AvatarInicialesComponent {
  @Input({ required: true }) iniciales = '';
  @Input() semilla = '';
  @Input() tamano = 36;

  private readonly paletas = [
    'bg-brand-100 text-brand-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-violet-100 text-violet-700',
  ];

  get claseColor(): string {
    const texto = this.semilla || this.iniciales;
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
      hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }
    const indice = Math.abs(hash) % this.paletas.length;
    return this.paletas[indice];
  }
}
