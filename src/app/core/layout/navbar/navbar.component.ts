import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { SessionService } from '../../services/session.service';
import { ROL_LABELS } from '../../models/usuario-sesion.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // Se usa inject() en vez de inyección por constructor para poder
  // referenciar el servicio en la misma línea en que se declaran los
  // campos de la clase (el orden de inicialización de campos ocurre
  // antes que el cuerpo del constructor).
  private readonly session = inject(SessionService);

  readonly usuario = this.session.usuarioActual;
  readonly notificaciones = this.session.notificacionesSinLeer;

  readonly rolLabel = computed(() => ROL_LABELS[this.usuario().rol]);
}
