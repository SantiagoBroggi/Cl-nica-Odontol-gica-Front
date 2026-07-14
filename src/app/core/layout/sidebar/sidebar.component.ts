import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS } from '../../services/nav.config';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private readonly session: SessionService) {}

  /**
   * Ítems del menú visibles para el rol del usuario actual. Un ítem sin
   * `roles` definidos es visible para todos los roles autenticados.
   */
  readonly items = computed(() => {
    const rol = this.session.usuarioActual().rol;
    return NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(rol));
  });
}
