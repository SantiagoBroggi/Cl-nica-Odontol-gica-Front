import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

/**
 * Layout general de la aplicación autenticada.
 *
 * Es el componente "cascarón" (shell) que envuelve todas las rutas de
 * negocio: fija el sidebar a la izquierda, la navbar arriba, y deja el
 * <router-outlet> para el contenido de cada módulo. Se configura como
 * componente padre en app.routes.ts para que todas las rutas hijas
 * hereden este layout sin repetirlo.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {}
